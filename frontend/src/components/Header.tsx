import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, Activity, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { SearchBar } from '@/components/SearchBar';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Products', icon: Package },
    { href: '/orders', label: 'Orders', icon: Package },
    { href: '/system-status', label: 'Status', icon: Activity },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img
            src="/logo.svg"
            alt="E-Commerce Logo"
            className="h-10 w-10"
          />
          <span className="hidden sm:inline-block">E‑Commerce</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <Link to="/cart" className="relative">
            <Button
              variant={isActive('/cart') ? 'default' : 'outline'}
              size="icon"
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-fade-in">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth button */}
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => login()} className="hidden sm:flex">
              Login
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              {isAuthenticated ? (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => login()}>
                  Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
