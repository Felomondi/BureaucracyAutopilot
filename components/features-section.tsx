export default function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-start justify-between mb-16">
          <div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">◆ CORE_FEATURES</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 max-w-lg leading-tight">
              Why people choose Bureaucracy Autopilot
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs hidden md:block">
            Speed without sacrifice. Accuracy without tedium. Privacy without compromise.
          </p>
        </div>

        {/* Top row features */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Smart Detection */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <span className="text-xs font-mono text-muted-foreground">FEATURE</span>
              <span className="text-xs font-mono text-muted-foreground">FORM_DETECTION</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="h-3 bg-green-200 rounded w-full"></div>
                <div className="h-3 bg-green-200 rounded w-4/5"></div>
                <div className="h-3 bg-yellow-200 rounded w-3/4"></div>
                <div className="h-3 bg-border rounded w-2/3"></div>
              </div>
              <div className="flex justify-end mt-3">
                <span className="text-[10px] font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">4 FIELDS DETECTED</span>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Form Detection</h3>
            <p className="text-sm text-muted-foreground">
              Detects inputs, selects, radios, and checkboxes. Works on React, Vue, and dynamic SPAs.
            </p>
          </div>

          {/* Profile Vault */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <span className="text-xs font-mono text-muted-foreground">FEATURE</span>
              <span className="text-xs font-mono text-muted-foreground">PROFILE_VAULT</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-2">
                {["Personal", "Business", "Student", "Custom"].map((profile, i) => (
                  <div
                    key={profile}
                    className={`text-center p-2 rounded-lg ${i === 0 ? "bg-primary/10 border border-primary/30" : "bg-card border border-border"}`}
                  >
                    <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-[10px]">{profile[0]}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{profile}</span>
                  </div>
                ))}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Profile Vault</h3>
            <p className="text-sm text-muted-foreground">
              Multiple profiles for different contexts. Identity, contact, employment, education—all organized.
            </p>
          </div>

          {/* Private By Design */}
          <div id="security" className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <span className="text-xs font-mono text-muted-foreground">FEATURE</span>
              <span className="text-xs font-mono text-muted-foreground">SECURITY_GRADE</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-accent flex items-center justify-center">
                  <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Local-First & Private</h3>
            <p className="text-sm text-muted-foreground">
              Data encrypted on your device. Sensitive fields require confirmation. Never auto-submits.
            </p>
          </div>
        </div>

        {/* Bottom row features */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Confidence Scoring */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex gap-6">
              <div className="bg-secondary/50 rounded-xl p-4 flex-shrink-0">
                <div className="space-y-2 w-24">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-mono">HIGH</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-[10px] font-mono">MEDIUM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-[10px] font-mono">ASK USER</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">METRIC</span>
                </div>
                <h3 className="font-semibold text-2xl mb-1">Confidence Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  High-confidence fields fill automatically. Uncertain fields prompt for review. You stay in control.
                </p>
              </div>
            </div>
          </div>

          {/* Resume & Autosave */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-muted-foreground">OUTPUT</span>
                </div>
                <h3 className="font-semibold text-2xl mb-1">Resume & Autosave</h3>
                <p className="text-sm text-muted-foreground">
                  Autosave snapshots of in-progress forms. Resume later on the same site. Never lose progress on long applications.
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 flex-shrink-0">
                <div className="flex gap-1">
                  {["S", "A", "V", "E"].map((letter, i) => (
                    <div
                      key={i}
                      className="w-8 h-10 bg-card border border-border rounded flex items-center justify-center"
                    >
                      <span className="font-mono text-lg">{letter}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
