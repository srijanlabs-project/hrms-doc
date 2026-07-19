/** Page footer per board T-001: session info left, copyright center, legal links right. */
export function FooterBar() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-8 border-t border-border py-4 text-xs text-ink-faint">
      <div className="flex items-center justify-between gap-4">
        <span>Last login: Today, 08:45 AM · IP: 106.51.18.22</span>
        <span>© {year} Staffsy. All rights reserved.</span>
        <span className="flex gap-4">
          <a href="/privacy" className="hover:text-primary">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-primary">
            Terms of Use
          </a>
          <a href="/support" className="hover:text-primary">
            Support
          </a>
        </span>
      </div>
    </footer>
  );
}
