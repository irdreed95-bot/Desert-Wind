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

  const handleOrder = () => {
    const message = `مرحباً، أريد طلب: ${product.title} - السعر: ${formattedPrice} د.ع`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[8000] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      data-testid="modal-backdrop"
    >
      <div
        className="relative bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[92dvh] overflow-y-auto flex flex-col shadow-2xl shadow-primary/10"
        onClick={e => e.stopPropagation()}
        data-testid="modal-product"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-white transition-colors"
          data-testid="button-modal-close"
        >
          <X size={20} />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}

        {/* Media — full width, video has controls */}
        {product.imageUrl ? (
          <div className="w-full bg-background rounded-t-2xl overflow-hidden" style={{ maxHeight: '340px' }}>
            <MediaRenderer
              src={product.imageUrl}
              alt={product.title}
              controls
              preview={false}
              className="w-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-muted/30 rounded-t-2xl flex items-center justify-center border-b border-border">
            <span className="text-muted-foreground text-sm">لا توجد صورة أو فيديو</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Title + Category */}
          <div>
            <p className="text-xs text-primary font-semibold mb-1">{categoryName}</p>
            <h2 className="text-xl font-black text-white leading-snug">{product.title}</h2>
          </div>

          {/* Price + Stock */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-3xl font-black text-primary">
              {formattedPrice}
              <span className="text-base font-normal text-primary/70 mr-1">د.ع</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              {product.stockStatus === 'in_stock' && (
                <><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" /><span className="text-emerald-400">{product.stockLabel || 'متوفر'}</span></>
              )}
              {product.stockStatus === 'low_stock' && (
                <><span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" /><span className="text-orange-400">{product.stockLabel}</span></>
              )}
              {product.stockStatus === 'out_of_stock' && (
                <><span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" /><span className="text-red-400">{product.stockLabel || 'نفذ من المخزون'}</span></>
              )}
            </div>
          </div>

          {/* Specs */}
          {product.specs && (
            <div className="bg-background border border-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-muted-foreground mb-2">المواصفات التفصيلية</h3>
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{product.specs}</p>
            </div>
          )}

          {/* WhatsApp Button */}
          <button
            onClick={handleOrder}
            disabled={product.stockStatus === 'out_of_stock'}
            className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-black text-base transition-all ${
              product.stockStatus === 'out_of_stock'
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-[#25D366] hover:bg-[#20bd5a] text-white active:scale-95'
            }`}
            data-testid="button-modal-order"
          >
            <SiWhatsapp size={22} />
            {product.stockStatus === 'out_of_stock' ? 'نفذت الكمية' : 'اطلب الآن عبر واتساب'}
          </button>
        </div>
      </div>
    </div>
  );
}
