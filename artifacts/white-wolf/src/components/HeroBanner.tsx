import { Banner } from '../hooks/useStore';
import { motion } from 'framer-motion';

export function HeroBanner({ banner }: { banner: Banner }) {
  return (
    <section className="relative w-full min-h-[75vh] flex items-center bg-background border-b border-border overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      {/* Animated Particles/Dots */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary animate-float"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 5 + 5 + 's',
              opacity: Math.random() * 0.5 + 0.3
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* RIGHT: Text content (RTL) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-right"
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6">
            {banner.title.split('الذيب الأبيض').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-primary drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                    الذيب الأبيض
                  </span>
                )}
              </span>
            ))}
            {!banner.title.includes('الذيب الأبيض') && banner.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {banner.subtitle}
          </p>
          <button 
            className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-lg text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            data-testid="button-hero-cta"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            {banner.ctaText}
          </button>
        </motion.div>

        {/* LEFT: Media */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-xl lg:max-w-none"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
            {banner.videoUrl ? (
              <video 
                src={banner.videoUrl} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : banner.imageUrl ? (
              <img 
                src={banner.imageUrl} 
                alt="Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-primary/30 m-4 rounded-xl bg-background/50">
                <p className="text-muted-foreground font-medium text-lg">صورة / فيديو إعلاني</p>
              </div>
            )}
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}