import React, { useState, useEffect, useCallback } from "react";
import { Search, ShoppingCart, Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

const products = [
  { id: 1, name: "بطاقة الرسومات RTX 4090", price: "8,500 ر.س", badge: "جديد" },
  { id: 2, name: "معالج Intel Core i9-14900K", price: "2,800 ر.س", badge: "" },
  { id: 3, name: "ذاكرة RAM 32GB DDR5", price: "650 ر.س", badge: "خصم 15%" },
  { id: 4, name: "SSD NVMe 2TB", price: "750 ر.س", badge: "" },
  { id: 5, name: "مزود طاقة 850W 80+ Gold", price: "650 ر.س", badge: "" },
  { id: 6, name: "لوحة أم Z790 AORUS", price: "1,500 ر.س", badge: "" },
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: "rtl" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    // Add dark mode explicitly just to be sure it matches the aesthetic
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="#" className="text-2xl font-black tracking-tight text-primary">الذيب الأبيض</a>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
              <a href="#" className="hover:text-primary transition-colors">الرئيسية</a>
              <a href="#" className="hover:text-primary transition-colors">المنتجات</a>
              <a href="#" className="hover:text-primary transition-colors">العروض</a>
              <a href="#" className="hover:text-primary transition-colors">تواصل معنا</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-primary transition-colors focus:outline-none">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-primary transition-colors focus:outline-none relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button 
              className="md:hidden p-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-4">
            <a href="#" className="hover:text-primary font-semibold">الرئيسية</a>
            <a href="#" className="hover:text-primary font-semibold">المنتجات</a>
            <a href="#" className="hover:text-primary font-semibold">العروض</a>
            <a href="#" className="hover:text-primary font-semibold">تواصل معنا</a>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-card border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
          
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center lg:text-right"
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-6">
                🚀 التجميعات الأسطورية
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
                مرحباً، تجميعة <span className="text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">الذيب الأبيض</span> متوفرة الآن!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
                اكتشف أحدث مكونات الكمبيوتر وابنِ جهازك المثالي لأداء لا يُقهر في الألعاب وتصميم المحتوى.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-md transition-all active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                  تسوق الآن
                </button>
                <button className="border border-border hover:bg-muted font-bold px-8 py-3 rounded-md transition-colors active:scale-95">
                  تصفح العروض
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 w-full max-w-lg lg:max-w-none relative"
            >
              <div className="relative border-2 border-dashed border-primary/50 bg-background/50 backdrop-blur-sm rounded-xl aspect-[4/3] flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                <span className="text-muted-foreground font-semibold text-lg relative z-10">صورة / فيديو إعلاني</span>
                {/* REPLACE THIS: Add your image or video here. For image: <img src="your-image.jpg" alt="..." className="absolute inset-0 w-full h-full object-cover" /> For video: <video src="your-video.mp4" autoPlay muted loop className="absolute inset-0 w-full h-full object-cover" /> */}
              </div>

              {/* Slider Controls Simulation */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <button className="w-2 h-2 rounded-full bg-primary"></button>
                <button className="w-2 h-2 rounded-full bg-border hover:bg-primary/50 transition-colors"></button>
                <button className="w-2 h-2 rounded-full bg-border hover:bg-primary/50 transition-colors"></button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black text-white">المنتجات المميزة</h2>
            <div className="flex gap-2">
              <button 
                onClick={scrollNext} // In RTL, next visually moves left
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors focus:outline-none"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollPrev} // In RTL, prev visually moves right
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden" ref={emblaRef} dir="rtl">
            <div className="flex gap-6">
              {products.map((product, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={product.id} 
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                >
                  <div className="bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,255,0.1)] hover:border-primary/50 group h-full flex flex-col">
                    <div className="aspect-square bg-muted/30 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center border border-transparent group-hover:border-primary/20 transition-colors">
                      {product.badge && (
                        <span className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-sm">
                          {product.badge}
                        </span>
                      )}
                      <span className="text-muted-foreground text-sm">صورة المنتج</span>
                      {/* REPLACE: product image <img src="..." alt={product.name} className="absolute inset-0 w-full h-full object-cover mix-blend-screen" /> */}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="mt-auto">
                        <div className="text-xl font-black text-primary mb-4">{product.price}</div>
                        <button className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          <span>أضف للسلة</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground font-medium">
          <p>© 2026 الذيب الأبيض - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
