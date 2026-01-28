export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Main hero area */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
              <span>BROWSER EXTENSION • FORM AUTOFILL</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-balance">
              Fill any form
              <br />
              in seconds.
            </h1>

            <p className="text-muted-foreground text-lg max-w-md">
              Detects fields, autofills from your profile, and asks for confirmation when it matters. Review-first workflow for speed, accuracy, and privacy.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">Local-first</span>
              <span className="text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">Review before submit</span>
              <span className="text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">Works on most sites</span>
            </div>

            <div className="flex gap-4 pt-2">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                Add to Chrome
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right visual - Form mockup */}
          <div className="relative">
            <div className="relative bg-secondary/50 rounded-3xl p-8 border border-border/50">
              {/* Top labels */}
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-4">
                <span>FORM_DETECTED</span>
                <span>CONFIDENCE: HIGH</span>
              </div>

              {/* Form mockup */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-muted-foreground">JOB APPLICATION</span>
                  <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">READY TO FILL</span>
                </div>
                
                {/* Form fields */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-10 bg-green-50 border border-green-200 rounded-lg flex items-center px-3">
                      <span className="text-sm text-green-700">John Doe</span>
                    </div>
                    <span className="text-[10px] font-mono text-green-600">HIGH</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-10 bg-green-50 border border-green-200 rounded-lg flex items-center px-3">
                      <span className="text-sm text-green-700">john@example.com</span>
                    </div>
                    <span className="text-[10px] font-mono text-green-600">HIGH</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-10 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center px-3">
                      <span className="text-sm text-yellow-700">123 Main St, City</span>
                    </div>
                    <span className="text-[10px] font-mono text-yellow-600">MED</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-10 bg-secondary border border-border rounded-lg flex items-center px-3">
                      <span className="text-sm text-muted-foreground">Cover letter...</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">ASK</span>
                  </div>
                </div>
              </div>

              {/* Review drawer preview */}
              <div className="absolute -right-4 top-24 bg-card border border-border rounded-xl p-4 shadow-lg max-w-[200px]">
                <div className="text-[10px] font-mono text-muted-foreground mb-2">REVIEW DRAWER</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Full Name</span>
                    <span className="text-[10px] text-green-600">✓ Profile</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Email</span>
                    <span className="text-[10px] text-green-600">✓ Profile</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Address</span>
                    <span className="text-[10px] text-yellow-600">Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
