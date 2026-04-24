import Link from "next/link"

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-mono">
      <header className="border-b border-[#222] bg-[#0D0D0D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF6600] flex items-center justify-center"><span className="text-xs font-bold">TD</span></div>
            <span className="font-bold tracking-[0.15em]">TRADEDADDY</span>
          </Link>
          <Link href="/" className="text-[#FF6600] hover:text-white text-sm">← BACK</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        <section>
          <h1 className="text-4xl font-bold text-[#FF6600] mb-6">TRADING ACADEMY</h1>
          <div className="border-l-2 border-[#FF6600] pl-4 mb-8">
            <p className="text-[#999] text-sm leading-relaxed">
              Comprehensive trading education from beginner to advanced levels. Learn trading fundamentals, technical analysis, risk management, psychology, and professional trading strategies. All lessons included with your subscription.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">CURRICULUM</h3>
              <div className="space-y-4">
                {[
                  {
                    level: "BEGINNER",
                    topics: ["What is forex trading?", "How to read charts", "Support & resistance", "Basic indicators", "Risk management 101"]
                  },
                  {
                    level: "INTERMEDIATE",
                    topics: ["Technical analysis patterns", "Candlestick patterns", "Multiple timeframe analysis", "Position sizing", "Trading psychology"]
                  },
                  {
                    level: "ADVANCED",
                    topics: ["Smart money concepts", "Order flow analysis", "Macro trading", "Portfolio management", "Professional strategies"]
                  },
                ].map((section, i) => (
                  <div key={i} className="border-l-2 border-[#FF6600] pl-4">
                    <p className="text-xs text-[#FF6600] font-bold mb-2">{section.level}</p>
                    <ul className="space-y-1">
                      {section.topics.map((topic, j) => (
                        <li key={j} className="text-sm text-[#888] flex items-center gap-2">
                          <span className="text-[#FF6600]">▶</span> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">LEARNING FORMATS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-bold text-white mb-2">Video Lessons</p>
                  <p className="text-xs text-[#888]">Screen recorded lessons explaining concepts with real examples</p>
                </div>
                <div>
                  <p className="font-bold text-white mb-2">Written Guides</p>
                  <p className="text-xs text-[#888]">Detailed guides and checklists for each trading concept</p>
                </div>
                <div>
                  <p className="font-bold text-white mb-2">Quizzes</p>
                  <p className="text-xs text-[#888]">Test your knowledge with interactive quizzes</p>
                </div>
                <div>
                  <p className="font-bold text-white mb-2">Case Studies</p>
                  <p className="text-xs text-[#888]">Real trading examples and market analysis breakdowns</p>
                </div>
              </div>
            </div>

            <div className="border border-[#1A1A1A] bg-[#0D0D0D] p-6">
              <h3 className="font-bold text-[#FF6600] mb-4">SPECIAL MODULES</h3>
              <div className="space-y-2">
                {[
                  "Market Psychology - Understanding trader behavior",
                  "Risk Management - Protecting your capital",
                  "Trade Journal - Analyzing your performance",
                  "Trading Psychology - Emotional control and discipline",
                  "Macro Trading - Understanding global economics",
                ].map((module, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-[#FF6600]">▶</span>
                    <span className="text-[#888]">{module}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#1A1A1A] pt-8">
          <h2 className="text-2xl font-bold text-[#FF6600] mb-6">GETTING STARTED</h2>
          <Link href="/auth/sign-up" className="inline-block bg-[#FF6600] hover:bg-[#FF7722] text-white text-sm font-bold px-6 py-3 tracking-wider transition-colors">
            START LEARNING TODAY
          </Link>
        </section>
      </main>
    </div>
  )
}
