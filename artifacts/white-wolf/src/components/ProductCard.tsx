import { useState } from 'react';
import { SiWhatsapp } from 'react-icons/si';
import { Product } from '../hooks/useStore';
import { MediaRenderer } from './MediaRenderer';
import { ProductModal } from './ProductModal';

const WA_NUMBER = '9647700094959';

export function ProductCard({ product }: { product: Product }) {
  const [showModal, setShowModal] = useState(false);
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const formattedPrice = product.price.toLocaleString('ar-IQ');

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't open modal when clicking WhatsApp button
    if (isOutOfStock) return;
    const message = `مرحباً، أريد طلب: ${product.title} - السعر: ${formattedPrice} د.ع`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* Card — entire surface is clickable */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setShowModal(true)}
        onKeyDown={e => e.key === 'Enter' && setShowModal(true)}
        className="flex-shrink-0 w-[220px] md:w-[260px] bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-primary"
        data-testid={`card-product-${product.id}`}
      >
        {/* Media Area */}
        <div className="h-[170px] bg-background relative overflow-hidden flex items-center justify-center">
          {product.badge && (
            <span className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              {product.badge}
            </span>
          )}

          {product.imageUrl ? (
            <MediaRenderer
              src={product.imageUrl}
              alt={product.title}
              preview  /* autoplay muted loop for video thumbnails */
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-muted/30 flex items-center justify-center border border-border/50">
              <span className="text-muted-foreground/50 text-sm">لا توجد صورة</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[14px] md:text-[15px] leading-snug mb-2 line-clamp-2 text-white group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>

          <div className="mt-auto pt-3">
            <div className="text-lg font-black text-primary mb-2">
              {formattedPrice}
              <span className="text-sm text-primary/70 font-normal mr-1">د.ع</span>
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs font-medium">
              {product.stockStatus === 'in_stock' && (
                <><span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" /><span className="text-emerald-500">{product.stockLabel || 'متوفر'}</span></>
              )}
              {product.stockStatus === 'low_stock' && (
                <><span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" /><span className="text-orange-500">{product.stockLabel}</span></>
              )}
              {product.stockStatus === 'out_of_stock' && (
                <><span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /><span className="text-red-500">{product.stockLabel || 'نفذ من المخزون'}</span></>
              )}
            </div>

            {/* WhatsApp button — stopPropagation so it doesn't open modal */}
            <button
              onClick={handleOrder}
              disabled={isOutOfStock}
              className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                isOutOfStock
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-[#25D366] hover:bg-[#20bd5a] text-white active:scale-95'
              }`}
              data-testid={`button-order-${product.id}`}
            >
              <SiWhatsapp size={17} />
              {isOutOfStock ? 'نفذت الكمية' : 'اطلب عبر واتساب'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showModal && (
        <ProductModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
