export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-6">
      <h1 className="text-4xl font-bold mb-6">📊 GitHub Dev Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">🌀 Last 3 Commits</h2>
        <img src="/api/commit-graph?user=aliasgarsogiawala" alt="Last 3 Commits Widget" className="border border-gray-700 rounded" />
        <pre className="bg-gray-900 p-4 mt-4 rounded overflow-auto text-sm">
{`![Last 3 Commits](https://your-vercel-deploy-url.vercel.app/api/commit-graph?user=your-username)`}
        </pre>
      </section>

      <section className="bg-gray-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">🌌 Ultimate GitHub Stats Card</h2>
        <p className="text-sm mb-4 text-gray-400">All-in-one snapshot of your coding life on GitHub.</p>

        <div className="space-y-6">
          <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=aliasgarsogiawala&theme=github_dark" alt="Profile Summary" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src="https://streak-stats.demolab.com?user=aliasgarsogiawala&theme=github-dark-blue&hide_border=true" alt="Streak" />
            <img src="https://github-readme-stats.vercel.app/api?username=aliasgarsogiawala&show_icons=true&theme=github_dark&include_all_commits=true&count_private=true&hide_title=true" alt="Stats" />
          </div>

          <img src="https://github-readme-activity-graph.vercel.app/graph?username=aliasgarsogiawala&bg_color=0D1117&color=00F7FF&line=007ACC&point=FFFFFF&area=true&hide_border=true" alt="Activity Graph" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img src="https://github-profile-trophy.vercel.app/?username=aliasgarsogiawala&theme=darkhub&no-frame=true&title=Stars,Followers,Commit,Repositories,PullRequest,Issues&column=3" alt="Trophies" />
            <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=aliasgarsogiawala&layout=donut&theme=github_dark&langs_count=8" alt="Top Languages" />
          </div>

          <div className="bg-[#161b22] p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🧠 New Ideas (Coming Soon)</h3>
            <ul className="list-disc list-inside text-gray-300 text-sm">
              <li>📅 Time spent coding this week (WakaTime API)</li>
              <li>📦 Most contributed repo this month</li>
              <li>🧠 Most complex PR merged</li>
              <li>💬 Most commented issue</li>
              <li>🧪 Personal scorecard based on velocity & impact</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}