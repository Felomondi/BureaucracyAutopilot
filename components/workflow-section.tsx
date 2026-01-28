export default function WorkflowSection() {
  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Add your name, contact info, address, and employment details. Start small, expand later.",
      visual: "profile",
    },
    {
      number: "02",
      title: "Visit Any Form",
      description: "Navigate to any web form. The extension detects fields automatically.",
      visual: "detect",
    },
    {
      number: "03",
      title: "Review & Confirm",
      description: "See suggested values with confidence scores. Approve, edit, or skip uncertain fields.",
      visual: "review",
    },
    {
      number: "04",
      title: "Submit Manually",
      description: "You always control submission. We never auto-submit forms without your action.",
      visual: "submit",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-16">
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ HOW_IT_WORKS</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 max-w-md leading-tight">
              From profile to submitted in seconds.
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            No CAPTCHAs bypassed. No auto-submit. Just you, faster.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-card border border-border rounded-2xl p-6 h-full">
                {/* Visual placeholder */}
                <div className="aspect-square bg-secondary/50 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                  {step.visual === "profile" && (
                    <div className="bg-card border border-border p-4 rounded-lg shadow-sm w-4/5">
                      <div className="space-y-2">
                        <div className="h-2 bg-primary/30 rounded w-1/2"></div>
                        <div className="h-2 bg-border rounded w-full"></div>
                        <div className="h-2 bg-border rounded w-3/4"></div>
                        <div className="h-2 bg-border rounded w-2/3"></div>
                      </div>
                    </div>
                  )}
                  {step.visual === "detect" && (
                    <div className="space-y-2 w-4/5">
                      <div className="h-3 bg-green-200 rounded w-full animate-pulse"></div>
                      <div className="h-3 bg-green-200 rounded w-4/5 animate-pulse"></div>
                      <div className="h-3 bg-yellow-200 rounded w-3/4 animate-pulse"></div>
                      <div className="flex gap-1 mt-3">
                        <span className="text-[10px] font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">DETECTED</span>
                      </div>
                    </div>
                  )}
                  {step.visual === "review" && (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-sm w-4/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-muted-foreground">REVIEW</span>
                        <span className="text-[10px] font-mono text-green-600">3/4</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div className="h-1.5 bg-border rounded flex-1"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div className="h-1.5 bg-border rounded flex-1"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div className="h-1.5 bg-border rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {step.visual === "submit" && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
                        <span className="text-xs font-mono text-primary">YOU SUBMIT</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                </div>
                <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
