import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { ROUTES, SOCIAL_LINKS } from "@shared/constants";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Accueil", href: ROUTES.HOME },
    { label: "Prestations", href: ROUTES.SERVICES },
    { label: "Livret Astral", href: ROUTES.BOOKLET },
    { label: "Rendez-vous", href: ROUTES.BOOKING },
    { label: "Blog", href: ROUTES.BLOG },
    { label: "À propos", href: ROUTES.ABOUT },
    { label: "FAQ", href: ROUTES.FAQ },
    { label: "Contact", href: ROUTES.CONTACT },
  ];

  const isActive = (href: string) => location === href;

  const navShellClass = scrolled
    ? "bg-card/90 backdrop-blur-xl border-b border-border/60 shadow-sm text-foreground"
    : "bg-black/25 backdrop-blur-md border-b border-white/10 text-white";

  const navLinkClass = (active: boolean) =>
    scrolled
      ? active
        ? "text-accent"
        : "text-foreground/80 hover:text-foreground"
      : active
        ? "text-accent"
        : "text-white/90 hover:text-white";

  const mobileLinkClass = (active: boolean) =>
    scrolled
      ? active
        ? "bg-accent/15 text-accent"
        : "text-foreground/80 hover:bg-muted/40"
      : active
        ? "bg-white/15 text-accent"
        : "text-white/90 hover:bg-white/10";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navShellClass}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href={ROUTES.HOME}>
              <a className="flex items-center gap-2 font-serif text-2xl font-bold text-accent hover:opacity-80 transition-opacity">
                <span className="text-xl">✦</span>
                <span className="hidden sm:inline tracking-wide">Les Tirages de Marie</span>
                <span className="sm:hidden tracking-wide">Marie</span>
              </a>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-7">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`text-sm font-semibold tracking-wide transition-colors ${navLinkClass(
                      isActive(item.href),
                    )}`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <Link href={ROUTES.ADMIN}>
                <a className="px-4 py-2 bg-accent text-accent-foreground rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-accent/30 transition-all">
                  Admin
                </a>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted/40 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${mobileLinkClass(
                      isActive(item.href),
                    )}`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <Link href={ROUTES.ADMIN}>
                <a
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold text-sm"
                >
                  Admin
                </a>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content — default top padding so content sits below the fixed
          nav. Pages with a full-bleed hero opt out via `-mt-16 md:-mt-20`
          on their first section (see Home.tsx). */}
      <main className="flex-1 pt-16 md:pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16 md:mt-24">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-serif text-xl font-bold text-accent mb-4">
                <span>✦</span>
                <span>Les Tirages de Marie</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Guidances spirituelles et livrets astrologiques personnalisés
                pour éclairer votre chemin.
              </p>
              <div className="flex gap-3">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                Navigation
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={ROUTES.HOME}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Accueil
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.SERVICES}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Prestations
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.BOOKLET}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Livret Astral
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.BOOKING}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Rendez-vous
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                Ressources
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={ROUTES.BLOG}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.FAQ}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      FAQ
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.ABOUT}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      À propos
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.CONTACT}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Contact
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                Légal
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={ROUTES.LEGAL_MENTIONS}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Mentions légales
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.LEGAL_PRIVACY}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      Politique de confidentialité
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Les Tirages de Marie. Tous droits
              réservés.
            </p>
            <p className="tracking-wide">
              <span className="text-accent">✦</span> Fait avec soin
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
