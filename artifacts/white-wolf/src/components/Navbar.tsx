import { Search } from 'lucide-react';
import { SiWhatsapp, SiInstagram, SiTelegram, SiFacebook, SiYoutube } from 'react-icons/si';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdmin: () => void;
}

export function Navbar({ searchQuery, setSearchQuery, onOpenAdmin }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* RIGHT: Logo */}
        <div className="flex-shrink-0">
          <a href="#" className="text-2xl font-black tracking-tight" data-testid="link-home">
            <span className="text-white">الذيب</span> <span className="text-primary drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]">الأبيض</span>
          </a>
        </div>

        {/* CENTER: Search */}
        <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full bg-card border border-border rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white placeholder-muted-foreground"
              data-testid="input-search"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* LEFT: Social & Admin */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <a href="https://wa.me/9647700094959" target="_blank" rel="noreferrer" className="text-[#25D366] hover:scale-110 transition-transform" data-testid="link-whatsapp">
              <SiWhatsapp size={20} />
            </a>
            <a href="https://www.instagram.com/al_yanabee?igsh=NnZuYngxZHJ0OHBw" target="_blank" rel="noreferrer" className="text-[#E1306C] hover:scale-110 transition-transform" data-testid="link-instagram">
              <SiInstagram size={20} />
            </a>
            <a href="https://t.me/alyanabe" target="_blank" rel="noreferrer" className="text-[#26A5E4] hover:scale-110 transition-transform" data-testid="link-telegram">
              <SiTelegram size={20} />
            </a>
            <a href="https://www.facebook.com/share/1BKVF98W2o/" target="_blank" rel="noreferrer" className="text-[#1877F2] hover:scale-110 transition-transform" data-testid="link-facebook">
              <SiFacebook size={20} />
            </a>
            <a href="https://youtube.com/@al_yanabee?si=HuBZLQfWVmAEzuK_" target="_blank" rel="noreferrer" className="text-[#FF0000] hover:scale-110 transition-transform hidden md:block" data-testid="link-youtube">
              <SiYoutube size={20} />
            </a>
          </div>

          <div className="w-px h-6 bg-border mx-1"></div>

          <button
            onClick={onOpenAdmin}
            className="text-xs bg-card hover:bg-muted border border-border px-3 py-1.5 rounded-full text-muted-foreground hover:text-white transition-colors"
            data-testid="button-admin"
          >
            لوحة التحكم
          </button>
        </div>

      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full bg-card border border-border rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-muted-foreground"
            data-testid="input-search-mobile"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
