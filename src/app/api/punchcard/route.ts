import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('user');
  if (!username) return NextResponse.json({ error: 'Missing user' }, { status: 400 });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return NextResponse.json({ error: 'Missing GitHub token' }, { status: 500 });

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const repos = await reposRes.json();
  if (!Array.isArray(repos)) return NextResponse.json({ error: 'Invalid user' }, { status: 404 });

  const punchCardMatrix: number[][] = Array(7).fill(0).map(() => Array(24).fill(0));
  let totalCommits = 0;
  let maxCommits = 0;
  let peakDay = 0;
  let peakHour = 0;
  let peakCount = 0;

  const dayTotals = Array(7).fill(0);
  const hourTotals = Array(24).fill(0);

  for (const repo of repos) {
    let data = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(`https://api.github.com/repos/${username}/${repo.name}/stats/punch_card`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 202) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      if (!res.ok) break;

      try {
        data = await res.json();
      } catch {
        // silently ignore
      }

      break;
    }

    if (Array.isArray(data)) {
      for (const [day, hour, count] of data) {
        punchCardMatrix[day][hour] += count;
        totalCommits += count;
        dayTotals[day] += count;
        hourTotals[hour] += count;

        if (punchCardMatrix[day][hour] > peakCount) {
          peakCount = punchCardMatrix[day][hour];
          peakDay = day;
          peakHour = hour;
        }

        maxCommits = Math.max(maxCommits, punchCardMatrix[day][hour]);
      }
    }
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayCommits = dayTotals.slice(1, 6).reduce((a, b) => a + b, 0);
  const weekendCommits = dayTotals[0] + dayTotals[6];
  const weekdayPercentage = Math.round((weekdayCommits / totalCommits) * 100) || 0;
  const weekendPercentage = Math.round((weekendCommits / totalCommits) * 100) || 0;

  const morningCommits = hourTotals.slice(5, 12).reduce((a, b) => a + b, 0);
  const afternoonCommits = hourTotals.slice(12, 18).reduce((a, b) => a + b, 0);
  const eveningCommits = hourTotals.slice(18, 24).reduce((a, b) => a + b, 0);
  const nightCommits = hourTotals.slice(0, 5).reduce((a, b) => a + b, 0);

  const cellSize = 20;
  const width = 24 * cellSize + 170;
  const height = 7 * cellSize + 220;

  const getColor = (count: number) => {
    if (count === 0) return '#cbd5e1';
    const intensity = Math.min(1, count / maxCommits);
    if (intensity < 0.3) return '#60a5fa';
    if (intensity < 0.6) return '#818cf8';
    if (intensity < 0.8) return '#a78bfa';
    return '#f472b6';
  };

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .label { font: 12px sans-serif; fill: #1f2937; }
    .cell { stroke: #e2e8f0; stroke-width: 1; }
    .title { font: bold 20px sans-serif; fill: #1e3a8a; }
    .subtitle { font: 14px sans-serif; fill: #334155; }
    .summary-title { font: bold 16px sans-serif; fill: #1e293b; }
    .summary-text { font: 14px sans-serif; fill: #475569; }
    .summary-highlight { font: bold 14px sans-serif; fill: #3b82f6; }
  </style>

  <rect width="100%" height="100%" fill="#e6f0ff" />

  <text x="20" y="30" class="title">GitHub Punch Card — ${username}</text>
  <text x="20" y="50" class="subtitle">Total Commits: ${totalCommits} | Peak Activity: ${dayNames[peakDay]} at ${peakHour}:00</text>

  ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => 
    `<text x="40" y="${i * cellSize + 95}" class="label" text-anchor="end">${d}</text>
     <text x="${24 * cellSize + 70}" y="${i * cellSize + 95}" class="label">${dayTotals[i]}</text>`
  ).join('')}

  ${Array.from({ length: 24 }).map((_, h) => 
    `<text x="${h * cellSize + 70}" y="70" class="label" text-anchor="middle">${h}</text>
     <text x="${h * cellSize + 70}" y="${7 * cellSize + 100}" class="label" text-anchor="middle">${hourTotals[h]}</text>`
  ).join('')}

  ${Array.from({ length: 7 }).map((_, day) => `
    ${Array.from({ length: 24 }).map((_, hour) => {
      const count = punchCardMatrix[day][hour];
      const color = getColor(count);
      return `<g>
        <rect 
          x="${hour * cellSize + 60}" 
          y="${day * cellSize + 80}" 
          width="${cellSize - 2}" 
          height="${cellSize - 2}" 
          rx="3" ry="3"
          class="cell" 
          fill="${color}" 
        >
          <title>${count} commit${count !== 1 ? 's' : ''} on ${dayNames[day]} at ${hour}:00</title>
        </rect>
      </g>`;
    }).join('')}
  `).join('')}

  <text x="30" y="${7 * cellSize + 140}" class="summary-title">Commit Patterns</text>
  <text x="30" y="${7 * cellSize + 165}" class="summary-text">Weekday: <tspan class="summary-highlight">${weekdayPercentage}%</tspan> vs Weekend: <tspan class="summary-highlight">${weekendPercentage}%</tspan></text>
  <text x="30" y="${7 * cellSize + 185}" class="summary-text">Time: Morning ${Math.round((morningCommits/totalCommits)*100)}% · Afternoon ${Math.round((afternoonCommits/totalCommits)*100)}% · Evening ${Math.round((eveningCommits/totalCommits)*100)}% · Night ${Math.round((nightCommits/totalCommits)*100)}%</text>
  <text x="${width - 30}" y="${7 * cellSize + 140}" class="summary-text" text-anchor="end">Most active: <tspan class="summary-highlight">${dayNames[peakDay]} at ${peakHour}:00</tspan></text>

  <g transform="translate(${width - 170}, ${height - 30})">
    <text x="0" y="12" class="label">Less</text>
    ${['#cbd5e1', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6'].map((color, i) =>
      `<rect x="${40 + i * 16}" y="0" width="12" height="12" fill="${color}" rx="2" ry="2" />`
    ).join('')}
    <text x="${40 + 5 * 16 + 10}" y="12" class="label">More</text>
  </g>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=3600'
    },
  });
}
