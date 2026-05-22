import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Product, CATEGORIES } from '../hooks/useStore';
import { MediaRenderer } from './MediaRenderer';

const WA_NUMBER = '9647700094959';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const formattedPrice = product.price.toLocaleString('ar-IQ');
  const categoryName = CATEGORIES.find(c => c.slug === product.category)?.name ?? product.category;
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  const handleOrder = () => {
    const message = `مرحباً، أريد طلب: ${product.title} - السعر: ${formattedPrice} د.ع`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[8000] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[92dvh] overflow-y-auto flex flex-col shadow-2xl shadow-primary/10"
        onClick={e => e.stopPropagation()}
      >

        {/* ── 1. MEDIA at the very top ── */}
        <div className="relative w-full bg-black rounded-t-2xl overflow-hidden flex-shrink-0">
          {/* Close button floats over media */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white/80 hover:text-white hover:bg-black/80 transition-colors"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>

          {product.imageUrl ? (
            <MediaRenderer
              src={product.imageUrl}
              alt={product.title}
              controls   /* full browser controls — play, pause, volume, timeline */
              preview={false}
              className="w-full"
            />
          ) : (
            <div className="h-48 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">لا توجد صورة أو فيديو</span>
            </div>
          )}
        </div>

        {/* ── 2. CONTENT below media ── */}
        <div className="p-5 flex flex-col gap-4">

          {/* ── 2a. Dynamic Badge — only shown when admin has set a value ── */}
          {product.badge && product.badge.trim() !== '' && (
            <div className="flex">
              <span className="inline-flex items-center bg-primary/15 border border-primary/40 text-primary text-sm font-black px-4 py-1.5 rounded-full tracking-wide">
                {product.badge}
              </span>
            </div>
          )}

          {/* ── 2b. Category label + Title ── */}
          <div>
            <p className="text-xs text-primary/70 font-semibold mb-1 uppercase tracking-widest">{categoryName}</p>
            <h2 className="text-xl font-black text-white leading-snug">{product.title}</h2>
          </div>

          {/* ── 2c. Price ── */}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-primary">{formattedPrice}</span>
            <span className="text-base font-normal text-primary/60">د.ع</span>
          </div>

          {/* ── 2d. Stock Status ── */}
          <div className="flex items-center gap-2 text-sm font-semibold">
            {product.stockStatus === 'in_stock' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_6px_theme(colors.emerald.500)]" />
                <span className="text-emerald-400">{product.stockLabel || 'متوفر'}</span>
              </>
            )}
            {product.stockStatus === 'low_stock' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_6px_theme(colors.orange.500)]" />
                <span className="text-orange-400">{product.stockLabel || 'الكمية محدودة'}</span>
              </>
            )}
            {product.stockStatus === 'out_of_stock' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-red-400">{product.stockLabel || 'نفذ من المخزون'}</span>
              </>
            )}
          </div>

          {/* ── 2e. Specifications ── */}
          {product.specs && product.specs.trim() !== '' && (
            <div className="bg-background border border-border/60 rounded-xl p-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2.5">
                المواصفات التفصيلية
              </h3>
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{product.specs}</p>
            </div>
          )}

          {/* ── 2f. WhatsApp Order button at the very bottom ── */}
          <button
            onClick={handleOrder}
            disabled={isOutOfStock}
            className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 font-black text-base transition-all ${
              isOutOfStock
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-[#25D366] hover:bg-[#20bd5a] text-white active:scale-[0.98] shadow-lg shadow-[#25D366]/20'
            }`}
          >
            <SiWhatsapp size={22} />
            {isOutOfStock ? 'نفذت الكمية' : 'اطلب الآن عبر واتساب'}
          </button>

        </div>
      </div>
    </div>
  );
}
