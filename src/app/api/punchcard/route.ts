import { NextResponse } from 'next/server';

// Helper function to format numbers with commas for readability
const formatNumber = (num: number) => {
  return num >= 1000 ? num.toLocaleString() : num.toString();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('user');
  const theme = searchParams.get('theme') || 'default';
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

  const cellSize = 22; // Increased from 20 to 22 for more horizontal spacing
  const width = 24 * cellSize + 250; // Increased to 250 for much more space
  const height = 7 * cellSize + 220;

  // Theme configurations
  const themes = {
    default: {
      background: '#e6f0ff',
      titleColor: '#1e3a8a',
      subtitleColor: '#334155',
      labelColor: '#1f2937',
      summaryTitleColor: '#1e293b',
      summaryTextColor: '#475569',
      summaryHighlightColor: '#3b82f6',
      colors: ['#cbd5e1', '#60a5fa', '#818cf8', '#a78bfa', '#f472b6']
    },
    dark: {
      background: '#0f172a',
      titleColor: '#f1f5f9',
      subtitleColor: '#cbd5e1',
      labelColor: '#e2e8f0',
      summaryTitleColor: '#f8fafc',
      summaryTextColor: '#cbd5e1',
      summaryHighlightColor: '#60a5fa',
      colors: ['#334155', '#1e40af', '#3730a3', '#7c3aed', '#db2777']
    },
    aqua: {
      background: '#ecfeff',
      titleColor: '#155e75',
      subtitleColor: '#0891b2',
      labelColor: '#0f766e',
      summaryTitleColor: '#134e4a',
      summaryTextColor: '#0f766e',
      summaryHighlightColor: '#0891b2',
      colors: ['#a7f3d0', '#34d399', '#10b981', '#059669', '#047857']
    }
  };

  const currentTheme = themes[theme as keyof typeof themes] || themes.default;

  const getColor = (count: number) => {
    if (count === 0) return currentTheme.colors[0];
    const intensity = Math.min(1, count / maxCommits);
    if (intensity < 0.3) return currentTheme.colors[1];
    if (intensity < 0.6) return currentTheme.colors[2];
    if (intensity < 0.8) return currentTheme.colors[3];
    return currentTheme.colors[4];
  };

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .label { font: 12px sans-serif; fill: ${currentTheme.labelColor}; }
    .number-label { font: 9px sans-serif; fill: ${currentTheme.labelColor}; }
    .cell { stroke: ${theme === 'dark' ? '#475569' : '#e2e8f0'}; stroke-width: 1; }
    .title { font: bold 18px sans-serif; fill: ${currentTheme.titleColor}; }
    .subtitle { font: 13px sans-serif; fill: ${currentTheme.subtitleColor}; }
    .summary-title { font: bold 16px sans-serif; fill: ${currentTheme.summaryTitleColor}; }
    .summary-text { font: 14px sans-serif; fill: ${currentTheme.summaryTextColor}; }
    .summary-highlight { font: bold 14px sans-serif; fill: ${currentTheme.summaryHighlightColor}; }
  </style>

  <rect width="100%" height="100%" fill="${currentTheme.background}" />

  <text x="20" y="30" class="title">GitHub Punch Card — ${username.length > 15 ? username.substring(0, 15) + '...' : username}</text>
  <text x="20" y="52" class="subtitle">Total Commits: ${formatNumber(totalCommits)} | Peak Activity: ${dayNames[peakDay]} at ${peakHour}:00</text>

  ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => 
    `<text x="50" y="${i * cellSize + 95}" class="label" text-anchor="end">${d}</text>
     <text x="${24 * cellSize + 90}" y="${i * cellSize + 95}" class="number-label">${formatNumber(dayTotals[i])}</text>`
  ).join('')}

  ${Array.from({ length: 24 }).map((_, h) => 
    `<text x="${h * cellSize + 82}" y="70" class="label" text-anchor="middle">${h}</text>
     <text x="${h * cellSize + 82}" y="${7 * cellSize + 100}" class="number-label" text-anchor="middle">${formatNumber(hourTotals[h])}</text>`
  ).join('')}

  ${Array.from({ length: 7 }).map((_, day) => `
    ${Array.from({ length: 24 }).map((_, hour) => {
      const count = punchCardMatrix[day][hour];
      const color = getColor(count);
      return `<g>
        <rect 
          x="${hour * cellSize + 70}" 
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

  <g transform="translate(${width - 200}, ${height - 30})">
    <text x="0" y="12" class="label">Less</text>
    ${currentTheme.colors.map((color, i) =>
      `<rect x="${40 + i * 16}" y="0" width="12" height="12" fill="${color}" rx="2" ry="2" />`
    ).join('')}
    <text x="${40 + 5 * 16 + 10}" y="12" class="label">More</text>
  </g>

  <text x="${width - 10}" y="${height - 10}" class="number-label" text-anchor="end" opacity="0.6">Developed by Aliasgar Sogiawala</text>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=3600'
    },
  });
}
