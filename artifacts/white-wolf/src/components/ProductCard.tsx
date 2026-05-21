import { Product } from '../hooks/useStore';
import { SiWhatsapp } from 'react-icons/si';

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stockStatus === 'out_of_stock';
  const formattedPrice = product.price.toLocaleString('ar-IQ');
  
  const handleOrder = () => {
    if (isOutOfStock) return;
    const message = `مرحباً، أريد طلب: ${product.title} - السعر: ${formattedPrice} د.ع`;
    window.open(`https://wa.me/9647800000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex-shrink-0 w-[240px] md:w-[280px] bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-colors flex flex-col h-full">
      {/* Image Area */}
      <div className="h-[180px] bg-background relative overflow-hidden flex items-center justify-center p-4">
        {product.badge && (
          <span className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
        
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-muted/30 rounded flex items-center justify-center border border-border/50">
            <span className="text-muted-foreground/50 text-sm">لا توجد صورة</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-[15px] md:text-base leading-tight mb-2 line-clamp-2 text-white group-hover:text-primary transition-colors min-h-[2.5rem]">
          {product.title}
        </h3>
        
        <div className="mt-auto pt-4">
          <div className="text-xl font-black text-primary mb-3">
            {formattedPrice} <span className="text-sm text-primary/70 font-normal">د.ع</span>
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs font-medium">
            {product.stockStatus === 'in_stock' && (
              <><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-emerald-500">{product.stockLabel || 'متوفر'}</span></>
            )}
            {product.stockStatus === 'low_stock' && (
              <><span className="w-2 h-2 rounded-full bg-orange-500"></span><span className="text-orange-500">{product.stockLabel}</span></>
            )}
            {product.stockStatus === 'out_of_stock' && (
              <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-500">{product.stockLabel || 'نفذ من المخزون'}</span></>
            )}
          </div>

          <button 
            onClick={handleOrder}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
              isOutOfStock 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-[#25D366] hover:bg-[#20bd5a] text-white active:scale-95'
            }`}
            data-testid={`button-order-${product.id}`}
          >
            <SiWhatsapp size={18} />
            {isOutOfStock ? 'نفذت الكمية' : 'اطلب عبر واتساب'}
          </button>
        </div>
      </div>
    </div>
  );
}