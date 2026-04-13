export default function Footer() {
  const links = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Research Documentation', href: '#' },
    { label: 'API Access', href: '#' },
  ];

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/10 py-10 px-6 md:px-10">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="text-xl font-bold text-primary font-headline tracking-tight">
          Ocean.Net
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-sm text-on-surface-variant text-center md:text-right">
          <p>© 2025 Ocean.Net</p>
          <p className="text-xs opacity-60 mt-0.5">University Research Initiative · LPU</p>
        </div>
      </div>
    </footer>
  );
}
