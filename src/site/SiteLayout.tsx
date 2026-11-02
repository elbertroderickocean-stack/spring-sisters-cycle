import { ReactNode, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Bracket = ({ className = "" }: { className?: string }) => (
  <span className={`font-semibold tracking-tight ${className}`}>[m]</span>
);

const links = [
  { to: "/site", label: "Brand" },
  { to: "/site#app", label: "App" },
  { to: "/site#shelf", label: "Open Shelf" },
  { to: "/site/shop", label: "Shop" },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-light min-h-screen bg-background text-foreground font-sans antialiased">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/site" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs text-primary-foreground">
              [m]
            </span>
            meanwhile
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/welcome"
              className="hidden rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.03] md:inline-flex"
            >
              Get the app
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full bg-secondary md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mb-4 flex flex-col rounded-3xl bg-card p-3 shadow-xl md:hidden"
            >
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-2xl font-medium tracking-tight hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/welcome"
                className="mt-2 rounded-2xl bg-primary px-4 py-3 text-center font-medium text-primary-foreground"
              >
                Get the app
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="mt-24 bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <p className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Skincare is an investment.
            <span className="text-primary"> We manage the interest.</span>
          </p>
          <div className="mt-14 grid gap-8 text-sm text-background/60 md:grid-cols-4">
            <div>
              <p className="mb-3 text-background">meanwhile</p>
              <p>SkinFinTech for the cycle-aware.</p>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/site/shop">Shop</Link>
              <Link to="/site#app">The app</Link>
              <Link to="/site#shelf">Open Shelf</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/login">Sign in</Link>
              <Link to="/welcome">Start your portfolio</Link>
            </div>
            <div className="md:text-right">
              <Bracket className="text-5xl text-primary" />
            </div>
          </div>
          <p className="mt-14 text-xs text-background/40">© {new Date().getFullYear()} meanwhile. Made for the long term.</p>
        </div>
      </footer>
    </div>
  );
}
