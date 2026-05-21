import { Product } from '../hooks/useStore';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export function ProductSection({ title, products }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="py-10 border-b border-border/50 last:border-0"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white relative pl-4">
            <span className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-l-md"></span>
            {title}
          </h2>
          {products.length > 4 && (
            <button className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              عرض الكل
            </button>
          )}
        </div>

        <div className="horizontal-scroll pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}