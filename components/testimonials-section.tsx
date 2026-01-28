export default function TestimonialsSection() {
  const useCases = [
    {
      id: "USE-001",
      title: "Job Applications",
      description: "Stop retyping your resume info. Fill applications in seconds, not minutes.",
      timeSaved: "10-30 min saved per application",
    },
    {
      id: "USE-002",
      title: "Government Portals",
      description: "DMV, taxes, permits—handle bureaucratic portals without the headache.",
      timeSaved: "15-45 min saved per form",
    },
    {
      id: "USE-003",
      title: "Insurance & Banking",
      description: "Intake forms, claims, account openings—all your details ready to go.",
      timeSaved: "10-20 min saved per form",
    },
    {
      id: "USE-004",
      title: "School & Education",
      description: "Enrollment, financial aid, transcripts—streamline academic paperwork.",
      timeSaved: "5-15 min saved per form",
    },
    {
      id: "USE-005",
      title: "HR & Onboarding",
      description: "New job paperwork, benefits enrollment, compliance forms—done fast.",
      timeSaved: "20-40 min saved per session",
    },
  ]

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-16">
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ USE_CASES</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 max-w-md leading-tight">
              Built for repetitive bureaucratic workflows
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            From job hunting to government paperwork—save hours every week.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {useCases.slice(0, 3).map((useCase) => (
            <div key={useCase.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-muted-foreground">REF</span>
                <span className="text-xs font-mono text-primary">{useCase.id}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-mono text-green-600">{useCase.timeSaved}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {useCases.slice(3, 5).map((useCase) => (
            <div key={useCase.id} className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-muted-foreground">REF</span>
                <span className="text-xs font-mono text-primary">{useCase.id}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-mono text-green-600">{useCase.timeSaved}</span>
              </div>
            </div>
          ))}

          {/* FAQ Preview */}
          <div className="bg-secondary/50 border border-dashed border-border rounded-2xl p-6">
            <h3 className="font-semibold text-lg mb-4">Common Questions</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Does it auto-submit forms?</p>
                <p className="text-muted-foreground">No. You always control submission.</p>
              </div>
              <div>
                <p className="font-medium">Does it bypass CAPTCHAs?</p>
                <p className="text-muted-foreground">No. Security controls remain intact.</p>
              </div>
              <div>
                <p className="font-medium">Where is data stored?</p>
                <p className="text-muted-foreground">Locally on your device, encrypted.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
