import { SiWhatsapp, SiInstagram, SiTelegram, SiFacebook, SiYoutube } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <a href="#" className="text-3xl font-black tracking-tight mb-4">
            <span className="text-white">الذيب</span> <span className="text-primary">الأبيض</span>
          </a>
          <p className="text-muted-foreground mb-8">
            وجهتك الأولى لأحدث أجهزة ومكونات الكمبيوتر في العراق. التجميعات الأسطورية بأفضل الأسعار.
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-12">
            <a href="https://wa.me/9647800000000" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#25D366] transition-colors" data-testid="footer-whatsapp">
              <SiWhatsapp size={24} />
            </a>
            <a href="https://instagram.com/_x1om_" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#E1306C] transition-colors" data-testid="footer-instagram">
              <SiInstagram size={24} />
            </a>
            <a href="https://t.me/whitewolfiq" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#26A5E4] transition-colors" data-testid="footer-telegram">
              <SiTelegram size={24} />
            </a>
            <a href="https://facebook.com/whitewolfiq" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#1877F2] transition-colors" data-testid="footer-facebook">
              <SiFacebook size={24} />
            </a>
            <a href="https://youtube.com/@whitewolfiq" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#FF0000] transition-colors" data-testid="footer-youtube">
              <SiYoutube size={24} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <p>© 2026 الذيب الأبيض - جميع الحقوق محفوظة</p>
          <p className="font-semibold text-white/50">العراق</p>
        </div>
      </div>
    </footer>
  );
}