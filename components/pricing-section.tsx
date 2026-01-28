export default function PricingSection() {
  const tiers = [
    {
      name: "FREE",
      price: "$0",
      description: "For individuals getting started with form automation.",
      features: [
        "Basic profile (contact + address)",
        "Bulk fill for high-confidence fields",
        "Review drawer",
        "Local encrypted storage",
        "Chrome extension",
      ],
      cta: "GET STARTED",
      highlighted: false,
    },
    {
      name: "PRO",
      price: "$9",
      period: "/mo",
      description: "For power users who fill forms daily.",
      features: [
        "Unlimited profiles",
        "Resume & autosave",
        "Employment + education schemas",
        "Document parsing (opt-in)",
        "Priority site compatibility",
        "Audit log export",
      ],
      cta: "START FREE TRIAL",
      highlighted: true,
    },
    {
      name: "TEAMS",
      price: "Custom",
      description: "For organizations with compliance needs.",
      features: [
        "Shared team profiles",
        "Admin controls",
        "Compliance audit exports",
        "SSO integration",
        "Priority support",
      ],
      cta: "CONTACT SALES",
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ PRICING</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-4">
            Simple pricing,
            <br />
            serious time savings
          </h2>
          <p className="text-muted-foreground text-sm">No hidden fees. Start free, upgrade when you need more.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-card border rounded-2xl p-6 relative ${
                tier.highlighted ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-mono px-3 py-1 rounded-full">
                  ◆ MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <span className="text-xs font-mono text-muted-foreground">{tier.name}</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-serif">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
