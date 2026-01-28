# Bureaucracy Autopilot

**Automatically fill web forms using your verified profile data, with a review-first workflow for speed, accuracy, and privacy.**

Bureaucracy Autopilot is a browser extension designed for repetitive form-filling workflows: job applications, government portals, insurance intake, school forms, HR paperwork, banking onboarding, and more. It detects online forms and completes them using your stored profile data—always with your review and confirmation.

---

## Features

### Form Detection & Autofill
- **Smart field detection** — Identifies common form schemas (contact info, address, employment, education) on standard HTML forms and single-page apps (React, Vue, Angular)
- **Confidence scoring** — High-confidence fields fill automatically; uncertain fields prompt for review
- **Bulk fill** — One click to fill all matched fields, with a review drawer showing what was filled and why

### Profile Vault
- **Multiple profiles** — Switch between contexts (Personal, Business, Student)
- **Structured data** — Identity, contact, addresses, employment history, education, documents
- **Multi-entry support** — Store multiple addresses, jobs, and education entries with a designated "primary" for autofill

### Privacy-First Design
- **Local-first storage** — Your data stays on your device, encrypted at rest
- **Review before submit** — Never auto-submits forms; you always confirm
- **Sensitive field protection** — SSN, passport, and other sensitive fields require explicit opt-in and confirmation

### Additional Capabilities
- **Field normalization** — Automatic formatting for phone numbers, dates, postal codes
- **Form resume** — Autosave progress and continue later
- **Audit log** — Track what was filled, from which source, and when

---

## Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/BureaucracyAutopilot.git
   cd BureaucracyAutopilot
   ```

2. Install dependencies and build the extension:
   ```bash
   cd extension
   npm install
   npm run build
   ```

3. Load in Chrome:
   - Go to `chrome://extensions`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `extension/dist` folder

4. (Optional) Run the web app:
   ```bash
   cd ..
   pnpm install
   pnpm run dev
   ```

---

## Project Structure

```
BureaucracyAutopilot/
├── app/                    # Next.js landing page
├── components/             # React components for landing page
├── extension/              # Chrome extension (Manifest V3)
│   ├── src/
│   │   ├── lib/            # Core logic (profile schema, storage, autofill engine)
│   │   ├── popup.html/js   # Extension popup UI
│   │   ├── options.html/js # Settings page
│   │   ├── onboarding.*    # Onboarding wizard
│   │   ├── content.js      # Content script (injected into pages)
│   │   └── autofillEngine.js # Shared autofill logic
│   ├── dist/               # Built extension (load this in Chrome)
│   └── tests/              # Sanity tests
├── lib/                    # Shared utilities
└── public/                 # Static assets
```

---

## How It Works

1. **Install** the extension and create your profile
2. **Visit** any web form (job application, government portal, etc.)
3. **Click Fill** — the extension detects fields and fills high-confidence matches
4. **Review** — a drawer shows all filled values with sources and confidence
5. **Submit** — you manually submit after confirming everything looks right

```
┌─────────────────────────────────────────────────────────────┐
│  Content Script                                             │
│  • Detects forms/fields on page                             │
│  • Calls AutofillEngine with profile data                   │
│  • Highlights filled fields                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  AutofillEngine                                             │
│  • Pattern matching (name, id, label, placeholder)          │
│  • Confidence scoring (autocomplete > exact > partial)      │
│  • Returns: filledFields[], skippedFields[] with reasons    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│  Profile Storage (chrome.storage.local)                     │
│  • Encrypted profile data                                   │
│  • Multi-entry support (addresses, jobs, education)         │
│  • Autofill policies per field                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security & Privacy

| Principle | Implementation |
|-----------|----------------|
| **Local-first** | All data stored locally in encrypted Chrome storage |
| **No auto-submit** | Forms are never submitted without explicit user action |
| **Sensitive field protection** | SSN, passport, etc. require opt-in and per-fill confirmation |
| **No tracking** | No third-party analytics or trackers in the extension |
| **Minimal permissions** | Only requests `storage`, `activeTab`, and `scripting` |

### Sensitive Fields

Fields like SSN, passport number, and voluntary identity information have special protections:
- **Opt-in required** — Must explicitly enable storage of sensitive data
- **Masked by default** — Values hidden until you click reveal
- **Autofill policies** — Choose "never", "confirm each time", "on click", or "bulk fill ok"
- **Site allowlists** — Restrict sensitive autofill to specific trusted domains

---

## Roadmap

| Version | Features |
|---------|----------|
| **v0.1** ✅ | Profile creation, basic form detection, bulk fill, review drawer |
| **v0.2** 🚧 | Employment/education schemas, form resume, site allowlist |
| **v0.3** | Document parsing (opt-in), improved SPA support |
| **v1.0** | Cloud sync (opt-in), team profiles, advanced audit logs |

---

## Contributing

Contributions are welcome! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `cd extension && npm test`
5. Commit with a clear message: `git commit -m "Add: your feature description"`
6. Push and open a Pull Request

### Areas We Need Help

- **Form compatibility** — Testing and fixing detection on specific websites
- **Field patterns** — Adding patterns for new field types or locales
- **Accessibility** — Improving keyboard navigation and screen reader support
- **Internationalization** — Adding support for non-US address/phone formats
- **Documentation** — Improving guides and examples
- **Bug reports** — Testing edge cases and reporting issues

### Development Guidelines

- Keep the extension lightweight (minimal dependencies)
- Prioritize user privacy in all features
- Write clear commit messages
- Add tests for new autofill patterns
- Test on multiple form types before submitting PRs

### Code Style

- Use clear, descriptive variable names
- Comment complex logic
- Follow existing patterns in the codebase

---

## FAQ

**Does it submit forms automatically?**  
No. Submission always requires your action.

**Does it bypass CAPTCHAs or bot protection?**  
No. The extension only fills form fields with your data.

**Where is my data stored?**  
Locally on your device, encrypted. Cloud sync is planned as an opt-in feature.

**What browsers are supported?**  
Currently Chrome (and Chromium-based browsers like Edge, Brave). Firefox support is planned.

**Can I use it for multiple people/contexts?**  
Yes! Create multiple profiles (Personal, Business, etc.) and switch between them.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) — Landing page
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)

---

<p align="center">
  <strong>Stop wasting time on forms.</strong><br>
  Fill applications in seconds, not hours.
</p>
