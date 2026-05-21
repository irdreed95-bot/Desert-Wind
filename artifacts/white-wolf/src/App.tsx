import { useState } from 'react';
import { useStore, CATEGORIES } from './hooks/useStore';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductSection } from './components/ProductSection';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { Search } from 'lucide-react';

export default function App() {
  const { products, banner, isLoaded, addProduct, updateProduct, deleteProduct, updateBanner } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  if (!isLoaded) return <div className="min-h-screen bg-background flex items-center justify-center text-primary font-bold">جاري التحميل...</div>;

  const filteredProducts = searchQuery.trim() 
    ? products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {searchQuery.trim() ? (
          // Search Results View
          <div className="container mx-auto px-4 py-12 flex-1">
            <div className="flex items-center gap-3 mb-8">
              <Search className="text-primary w-6 h-6" />
              <h2 className="text-2xl font-black text-white">نتائج البحث عن: "{searchQuery}"</h2>
              <span className="text-muted-foreground mr-auto bg-muted px-3 py-1 rounded-full text-sm">
                {filteredProducts.length} نتيجة
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج مطابقة</h3>
                <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو تفقد أقسام المنتجات</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-6 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90"
                >
                  العودة للرئيسية
                </button>
              </div>
            )}
          </div>
        ) : (
          // Normal Store View
          <>
            <HeroBanner banner={banner} />
            
            <div className="py-12 flex flex-col gap-4">
              {CATEGORIES.map(category => {
                let sectionProducts = [];
                
                if (category.slug === 'best_selling') {
                  sectionProducts = products.filter(p => p.isBestSelling);
                } else if (category.slug === 'custom_builds') {
                  sectionProducts = products.filter(p => p.isFeatured || p.category === 'custom_builds');
                } else {
                  sectionProducts = products.filter(p => p.category === category.slug);
                }

                return (
                  <ProductSection 
                    key={category.slug} 
                    title={category.name} 
                    products={sectionProducts} 
                  />
                );
              })}
            </div>
          </>
        )}
      </main>

      <Footer />

      {isAdminOpen && (
        <AdminPanel 
          onClose={() => setIsAdminOpen(false)}
          products={products}
          banner={banner}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
          updateBanner={updateBanner}
        />
      )}
    </div>
  );
}