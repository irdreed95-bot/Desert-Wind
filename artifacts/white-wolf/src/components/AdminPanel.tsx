import { useState } from 'react';
import { Product, Banner, CATEGORIES } from '../hooks/useStore';
import { X, Edit, Trash2, Plus } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  banner: Banner;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateBanner: (b: Partial<Banner>) => void;
}

export function AdminPanel({ onClose, products, banner, addProduct, updateProduct, deleteProduct, updateBanner }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'products' | 'banner'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  
  // Banner state
  const [bannerForm, setBannerForm] = useState(banner);
  const [bannerToast, setBannerToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'wolf2026') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner(bannerForm);
    setBannerToast(true);
    setTimeout(() => setBannerToast(false), 3000);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    if (editingProduct.id) {
      updateProduct(editingProduct.id, editingProduct);
    } else {
      addProduct(editingProduct as Omit<Product, 'id'>);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      deleteProduct(id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white"><X size={24} /></button>
        <div className={`bg-card border border-border p-8 rounded-2xl w-full max-w-sm ${error ? 'animate-shake border-red-500' : ''}`}>
          <h2 className="text-2xl font-black text-center mb-6 text-white">لوحة تحكم الذيب الأبيض</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور" 
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-center focus:border-primary focus:outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center">كلمة المرور خاطئة</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
      <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
          <div className="flex gap-2 mr-8">
            <button 
              onClick={() => setActiveTab('products')} 
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white bg-muted'}`}
            >
              المنتجات
            </button>
            <button 
              onClick={() => setActiveTab('banner')} 
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'banner' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white bg-muted'}`}
            >
              البنر الإعلاني
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsAuthenticated(false)} className="text-sm text-muted-foreground hover:text-white">تسجيل الخروج</button>
          <button onClick={onClose} className="p-2 bg-muted rounded-full hover:bg-border transition-colors"><X size={20} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          
          {activeTab === 'banner' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">إعدادات البنر الإعلاني</h3>
              <form onSubmit={handleSaveBanner} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">عنوان البنر</label>
                  <input type="text" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">النص الفرعي</label>
                  <input type="text" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">نص زر الإجراء</label>
                  <input type="text" value={bannerForm.ctaText} onChange={e => setBannerForm({...bannerForm, ctaText: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">رابط الصورة (الصق رابط صورة هنا)</label>
                  <input type="text" value={bannerForm.imageUrl} onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none text-left dir-ltr" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">رابط الفيديو (يأخذ الأولوية على الصورة)</label>
                  <input type="text" value={bannerForm.videoUrl} onChange={e => setBannerForm({...bannerForm, videoUrl: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none text-left dir-ltr" dir="ltr" />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-lg hover:bg-primary/90">حفظ البنر</button>
                  {bannerToast && <span className="text-emerald-500 font-medium">تم الحفظ بنجاح</span>}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              {!editingProduct ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">قائمة المنتجات ({products.length})</h3>
                    <button 
                      onClick={() => setEditingProduct({ currency: 'IQD', stockStatus: 'in_stock', isFeatured: false, isBestSelling: false, category: 'cpus' })}
                      className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90"
                    >
                      <Plus size={18} /> إضافة منتج
                    </button>
                  </div>
                  
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-muted border-b border-border text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-semibold w-1/3">اسم المنتج</th>
                          <th className="px-4 py-3 font-semibold">الفئة</th>
                          <th className="px-4 py-3 font-semibold">السعر</th>
                          <th className="px-4 py-3 font-semibold">المخزون</th>
                          <th className="px-4 py-3 font-semibold text-left">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-3 font-medium truncate max-w-[200px]">{p.title}</td>
                            <td className="px-4 py-3 text-muted-foreground">{CATEGORIES.find(c => c.slug === p.category)?.name || p.category}</td>
                            <td className="px-4 py-3 font-bold text-primary">{p.price.toLocaleString('ar-IQ')}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs ${p.stockStatus === 'in_stock' ? 'bg-emerald-500/20 text-emerald-500' : p.stockStatus === 'out_of_stock' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                {p.stockStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-left">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingProduct(p)} className="p-1.5 bg-muted hover:bg-secondary text-white rounded transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 bg-muted hover:bg-red-500/20 text-red-500 rounded transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">{editingProduct.id ? 'تعديل منتج' : 'إضافة منتج جديد'}</h3>
                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm text-muted-foreground mb-1">اسم المنتج *</label>
                      <input type="text" value={editingProduct.title || ''} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" required />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm text-muted-foreground mb-1">السعر (د.ع) *</label>
                      <input type="number" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" required min="0" />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm text-muted-foreground mb-1">الفئة</label>
                      <select value={editingProduct.category || 'cpus'} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none">
                        {CATEGORIES.filter(c => c.slug !== 'best_selling').map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">حالة المخزون</label>
                        <select value={editingProduct.stockStatus || 'in_stock'} onChange={e => setEditingProduct({...editingProduct, stockStatus: e.target.value as any})} className="w-full bg-background border border-border rounded-lg px-2 py-2 focus:border-primary focus:outline-none text-sm">
                          <option value="in_stock">متوفر (in_stock)</option>
                          <option value="low_stock">باقي قليل (low_stock)</option>
                          <option value="out_of_stock">نفذ (out_of_stock)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">تفاصيل المخزون</label>
                        <input type="text" value={editingProduct.stockLabel || ''} onChange={e => setEditingProduct({...editingProduct, stockLabel: e.target.value})} placeholder="مثال: باقي قطعتان" className="w-full bg-background border border-border rounded-lg px-2 py-2 focus:border-primary focus:outline-none text-sm" />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm text-muted-foreground mb-1">رابط الصورة</label>
                      <input type="text" value={editingProduct.imageUrl || ''} onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none dir-ltr text-left" dir="ltr" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm text-muted-foreground mb-1">الشارة (Badge)</label>
                      <input type="text" value={editingProduct.badge || ''} onChange={e => setEditingProduct({...editingProduct, badge: e.target.value})} placeholder="مثال: جديد, خصم 20%" className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none" />
                    </div>

                    <div className="col-span-2 md:col-span-1 flex items-center gap-6 pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingProduct.isFeatured || false} onChange={e => setEditingProduct({...editingProduct, isFeatured: e.target.checked})} className="w-4 h-4 accent-primary" />
                        <span className="text-sm font-medium">منتج مميز (يظهر في التجميعات)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingProduct.isBestSelling || false} onChange={e => setEditingProduct({...editingProduct, isBestSelling: e.target.checked})} className="w-4 h-4 accent-primary" />
                        <span className="text-sm font-medium">الأكثر مبيعاً</span>
                      </label>
                    </div>

                    <div className="col-span-2 mt-4 flex gap-4">
                      <button type="submit" className="bg-primary text-primary-foreground font-bold px-6 py-2 rounded-lg hover:bg-primary/90 flex-1">حفظ المنتج</button>
                      <button type="button" onClick={() => setEditingProduct(null)} className="bg-muted text-white font-bold px-6 py-2 rounded-lg hover:bg-border w-32">إلغاء</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}