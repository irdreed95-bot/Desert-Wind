import { useState, useEffect, useCallback } from 'react';
import { dbGet, dbSet } from '../lib/db';

export interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock';
  stockLabel: string;
  imageUrl: string;
  specs: string;
  category: string;
  badge: string;
  isFeatured: boolean;
  isBestSelling: boolean;
}

export interface Banner {
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  videoUrl: string;
}

const DEFAULT_BANNER: Banner = {
  title: "مرحباً، تجميعة الذيب الأبيض متوفرة الآن!",
  subtitle: "اكتشف أحدث مكونات الكمبيوتر وابنِ جهازك المثالي",
  ctaText: "تسوق الآن",
  imageUrl: "",
  videoUrl: "",
};

const DEFAULT_PRODUCTS: Omit<Product, 'id'>[] = [
  { title: "Intel Core i9-14900K", price: 1850000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "cpus", badge: "", isFeatured: false, isBestSelling: false },
  { title: "AMD Ryzen 9 7950X", price: 1650000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "cpus", badge: "", isFeatured: false, isBestSelling: false },
  { title: "Intel Core i7-13700K", price: 950000, currency: "IQD", stockStatus: "low_stock", stockLabel: "باقي 3 قطع", imageUrl: "", specs: "", category: "cpus", badge: "", isFeatured: false, isBestSelling: true },

  { title: "RTX 4090", price: 3200000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "gpus", badge: "الأقوى", isFeatured: true, isBestSelling: false },
  { title: "RTX 4070 Ti", price: 1800000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "gpus", badge: "", isFeatured: false, isBestSelling: true },
  { title: "RX 7900 XTX", price: 2100000, currency: "IQD", stockStatus: "low_stock", stockLabel: "باقي قطعتان", imageUrl: "", specs: "", category: "gpus", badge: "", isFeatured: false, isBestSelling: false },

  { title: "Kingston 32GB DDR5", price: 420000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "ram", badge: "", isFeatured: false, isBestSelling: false },
  { title: "Corsair 64GB DDR5", price: 780000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "ram", badge: "جديد", isFeatured: false, isBestSelling: false },
  { title: "G.Skill 16GB DDR4", price: 210000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "ram", badge: "", isFeatured: false, isBestSelling: true },

  { title: "Samsung 990 Pro 2TB NVMe", price: 480000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "storage", badge: "", isFeatured: false, isBestSelling: true },
  { title: "WD Black 4TB HDD", price: 280000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "storage", badge: "", isFeatured: false, isBestSelling: false },
  { title: "Seagate Barracuda 2TB", price: 150000, currency: "IQD", stockStatus: "out_of_stock", stockLabel: "نفذ من المخزون", imageUrl: "", specs: "", category: "storage", badge: "", isFeatured: false, isBestSelling: false },

  { title: 'Samsung Odyssey G9 49"', price: 2800000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "monitors", badge: "إلترا وايد", isFeatured: false, isBestSelling: false },
  { title: 'LG UltraGear 27" 165Hz', price: 680000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "monitors", badge: "", isFeatured: false, isBestSelling: true },
  { title: "ASUS ROG Swift 240Hz", price: 920000, currency: "IQD", stockStatus: "low_stock", stockLabel: "باقي قطعة واحدة", imageUrl: "", specs: "", category: "monitors", badge: "", isFeatured: false, isBestSelling: false },

  { title: "تجميعة الذيب الأبيض - الأسطورة", price: 8500000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "custom_builds", badge: "حصري", isFeatured: true, isBestSelling: false },
  { title: "تجميعة المحترف للتصميم", price: 5200000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "custom_builds", badge: "", isFeatured: true, isBestSelling: false },
  { title: "تجميعة الميزانية المتوسطة", price: 2800000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "custom_builds", badge: "", isFeatured: true, isBestSelling: true },

  { title: "Corsair HX1000 1000W", price: 580000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "psu_cases", badge: "", isFeatured: false, isBestSelling: false },
  { title: "LIAN LI PC-O11 Dynamic", price: 420000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "psu_cases", badge: "الأكثر مبيعاً", isFeatured: false, isBestSelling: false },
  { title: "NZXT H7 Flow", price: 380000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "psu_cases", badge: "", isFeatured: false, isBestSelling: false },

  { title: "Logitech G Pro X TKL", price: 320000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "accessories", badge: "", isFeatured: false, isBestSelling: true },
  { title: "Razer DeathAdder V3", price: 180000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "accessories", badge: "", isFeatured: false, isBestSelling: false },
  { title: "SteelSeries Arctis Nova Pro", price: 420000, currency: "IQD", stockStatus: "low_stock", stockLabel: "باقي قطعتان", imageUrl: "", specs: "", category: "accessories", badge: "جديد", isFeatured: false, isBestSelling: false },

  { title: "RTX 3080 مستعملة", price: 750000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "offers", badge: "خصم 40%", isFeatured: false, isBestSelling: false },
  { title: "Bundle معالج + لوحة أم", price: 1400000, currency: "IQD", stockStatus: "in_stock", stockLabel: "متوفر", imageUrl: "", specs: "", category: "offers", badge: "عرض خاص", isFeatured: false, isBestSelling: true },
];

export const CATEGORIES = [
  { slug: 'best_selling', name: 'الأكثر مبيعاً' },
  { slug: 'custom_builds', name: 'التجميعات الأسطورية' },
  { slug: 'cpus', name: 'المعالجات' },
  { slug: 'gpus', name: 'كروت الشاشة' },
  { slug: 'storage', name: 'وسائط التخزين' },
  { slug: 'ram', name: 'الذاكرة العشوائية' },
  { slug: 'psu_cases', name: 'مزودات الطاقة والكيسات' },
  { slug: 'monitors', name: 'الشاشات' },
  { slug: 'accessories', name: 'الملحقات والإكسسوارات' },
  { slug: 'offers', name: 'العروض الخاصة' },
];

// ── Quota / generic save-error handler ──────────────────────────────────────
function handleSaveError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  const isQuota =
    msg.includes('QuotaExceeded') ||
    msg.includes('NS_ERROR_DOM_QUOTA_REACHED') ||
    msg.includes('exceeded');

  if (isQuota) {
    alert('الملف حجمه كبير جداً — يرجى رفع صورة أو فيديو بحجم أصغر أو تقليل مدة الفيديو.');
  } else {
    alert('حدث خطأ أثناء الحفظ. يرجى المحاولة مجدداً.');
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────
export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<Banner>(DEFAULT_BANNER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from IndexedDB on mount
  useEffect(() => {
    (async () => {
      try {
        const [savedProducts, savedBanner] = await Promise.all([
          dbGet<Product[]>('ww_products'),
          dbGet<Banner>('ww_banner'),
        ]);

        if (savedProducts && savedProducts.length > 0) {
          setProducts(savedProducts);
        } else {
          const seeded = DEFAULT_PRODUCTS.map(p => ({ ...p, id: crypto.randomUUID() }));
          setProducts(seeded);
          // Best-effort seed — don't block UI if it fails
          dbSet('ww_products', seeded).catch(() => {});
        }

        if (savedBanner) {
          setBanner(savedBanner);
        } else {
          // Best-effort — default banner needs no persistence until edited
          setBanner(DEFAULT_BANNER);
        }
      } catch {
        // IndexedDB unavailable (private browsing, etc.) — fall back to defaults
        const seeded = DEFAULT_PRODUCTS.map(p => ({ ...p, id: crypto.randomUUID() }));
        setProducts(seeded);
        setBanner(DEFAULT_BANNER);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const addProduct = useCallback((p: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...p, id: crypto.randomUUID() };
    setProducts(prev => {
      const updated = [...prev, newProduct];
      dbSet('ww_products', updated).catch(handleSaveError);
      return updated;
    });
  }, []);

  const updateProduct = useCallback((id: string, p: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(prod => (prod.id === id ? { ...prod, ...p } : prod));
      dbSet('ww_products', updated).catch(handleSaveError);
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.filter(prod => prod.id !== id);
      dbSet('ww_products', updated).catch(handleSaveError);
      return updated;
    });
  }, []);

  const updateBanner = useCallback((b: Partial<Banner>) => {
    setBanner(prev => {
      const updated = { ...prev, ...b };
      dbSet('ww_banner', updated).catch(handleSaveError);
      return updated;
    });
  }, []);

  return { products, banner, isLoaded, addProduct, updateProduct, deleteProduct, updateBanner };
}
