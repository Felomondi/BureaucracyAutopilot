export default function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 border-2 border-foreground rounded-sm flex items-center justify-center">
                <span className="text-[10px] font-mono">B</span>
              </div>
              <span className="font-serif">Bureaucracy Autopilot</span>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              FORM AUTOFILL
              <br />
              BROWSER EXTENSION
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-4">◆ LOCAL-FIRST • PRIVACY-FOCUSED</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-mono text-muted-foreground mb-4">PRODUCT</h4>
            <ul className="space-y-2">
              {["Features", "How_It_Works", "Pricing", "Changelog"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace("_", "-")}`} className="text-sm hover:text-primary transition-colors">
                    {link.replace("_", " ")}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-xs font-mono text-muted-foreground mb-4">SECURITY</h4>
            <ul className="space-y-2">
              {["Privacy_Policy", "Security_Overview", "Data_Handling", "GDPR_Compliance"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-primary transition-colors">
                    {link.replace("_", " ")}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-mono text-muted-foreground mb-4">SUPPORT</h4>
            <ul className="space-y-2">
              {["Help_Center", "Contact", "FAQ", "Report_Issue"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-primary transition-colors">
                    {link.replace("_", " ")}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-xs font-mono text-muted-foreground mb-4">STATUS</h4>
            <div className="bg-secondary/50 rounded-xl p-4 font-mono text-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-600">ALL SYSTEMS OPERATIONAL</span>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <p>Chrome Extension: Active</p>
                <p>Edge Extension: Coming Soon</p>
                <p>Firefox: Planned</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">© 2026 Bureaucracy Autopilot. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Your data stays on your device. Always.</p>
        </div>
      </div>
    </footer>
  )
}
