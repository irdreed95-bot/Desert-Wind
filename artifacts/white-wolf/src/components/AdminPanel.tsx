import { useState, useRef } from 'react';
import { Product, Banner, CATEGORIES } from '../hooks/useStore';
import { X, Edit, Trash2, Plus, Upload, ImageIcon, Video } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  banner: Banner;
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateBanner: (b: Partial<Banner>) => void;
}

const STOCK_LABELS: Record<string, string> = {
  in_stock: 'متوفر',
  low_stock: 'باقي قليل',
  out_of_stock: 'نفذ من المخزون',
};

function FileUploadField({
  label,
  note,
  accept,
  currentValue,
  onChange,
}: {
  label: string;
  note?: string;
  accept: string;
  currentValue: string;
  onChange: (base64: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Warn immediately for very large files (> 80 MB)
    const MAX_BYTES = 80 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      alert('الملف حجمه كبير جداً — يرجى رفع صورة أو فيديو بحجم أصغر أو تقليل مدة الفيديو.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        onChange(reader.result as string);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isQuota =
          msg.includes('QuotaExceeded') ||
          msg.includes('NS_ERROR_DOM_QUOTA_REACHED') ||
          msg.includes('exceeded');
        if (isQuota) {
          alert('الملف حجمه كبير جداً — يرجى رفع صورة أو فيديو بحجم أصغر أو تقليل مدة الفيديو.');
        } else {
          alert('حدث خطأ أثناء معالجة الملف. يرجى المحاولة مجدداً.');
        }
      }
    };

    reader.onerror = () => {
      alert('تعذّر قراءة الملف. يرجى المحاولة مجدداً.');
    };

    reader.readAsDataURL(file);
  };

  const isVideo = currentValue.startsWith('data:video') || currentValue.match(/\.(mp4|webm|ogg)$/i);
  const hasMedia = !!currentValue;

  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1">{label}</label>
      {note && <p className="text-xs text-muted-foreground/70 mb-2">{note}</p>}

      {/* Preview */}
      {hasMedia && (
        <div className="mb-2 relative w-full h-32 bg-background rounded-lg overflow-hidden border border-border flex items-center justify-center">
          {isVideo ? (
            <video src={currentValue} className="h-full w-full object-contain" muted />
          ) : (
            <img src={currentValue} alt="" className="h-full w-full object-contain" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 left-2 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
            title="حذف الملف"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-3 px-4 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Upload size={16} />
        {hasMedia ? 'تغيير الملف' : 'اختر صورة أو فيديو من جهازك'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />

      {/* Optional URL fallback */}
      <div className="mt-2">
        <input
          type="text"
          value={currentValue.startsWith('data:') ? '' : currentValue}
          onChange={e => onChange(e.target.value)}
          placeholder="أو الصق رابط URL مباشر هنا..."
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none text-muted-foreground"
          dir="ltr"
        />
      </div>
    </div>
  );
}

export function AdminPanel({ onClose, products, banner, addProduct, updateProduct, deleteProduct, updateBanner }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState<'products' | 'banner'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [bannerForm, setBannerForm] = useState(banner);
  const [bannerToast, setBannerToast] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'wolf2026') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
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
      addProduct({
        title: editingProduct.title || '',
        price: editingProduct.price || 0,
        currency: 'IQD',
        stockStatus: editingProduct.stockStatus || 'in_stock',
        stockLabel: editingProduct.stockLabel || 'متوفر',
        imageUrl: editingProduct.imageUrl || '',
        specs: editingProduct.specs || '',
        category: editingProduct.category || 'cpus',
        badge: editingProduct.badge || '',
        isFeatured: editingProduct.isFeatured || false,
        isBestSelling: editingProduct.isBestSelling || false,
      });
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
    }
  };

  /* ── Password Gate ── */
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-white" data-testid="button-close-admin">
          <X size={24} />
        </button>
        <div className={`bg-card border p-8 rounded-2xl w-full max-w-sm transition-colors ${error ? 'animate-shake border-red-500' : 'border-border'}`}>
          <h2 className="text-2xl font-black text-center mb-2 text-white">لوحة تحكم</h2>
          <p className="text-center text-primary font-bold text-lg mb-6">الذيب الأبيض</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              data-testid="input-admin-password"
            />
            {error && <p className="text-red-500 text-sm text-center font-semibold">كلمة المرور خاطئة</p>}
            <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition-all" data-testid="button-admin-login">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Main Admin Panel ── */
  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
      {/* Header */}
      <div className="h-auto min-h-[64px] border-b border-border flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-card">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-white whitespace-nowrap">لوحة التحكم</h2>
          <div className="flex gap-2 mr-2">
            <button
              onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white bg-muted'}`}
              data-testid="tab-products"
            >
              المنتجات
            </button>
            <button
              onClick={() => setActiveTab('banner')}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === 'banner' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-white bg-muted'}`}
              data-testid="tab-banner"
            >
              البنر
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAuthenticated(false)} className="text-xs text-muted-foreground hover:text-white transition-colors" data-testid="button-logout">
            تسجيل الخروج
          </button>
          <button onClick={onClose} className="p-2 bg-muted rounded-full hover:bg-border transition-colors" data-testid="button-close-panel">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">

          {/* ── Banner Tab ── */}
          {activeTab === 'banner' && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon size={20} className="text-primary" />
                <h3 className="text-lg font-bold">إعدادات البنر الإعلاني</h3>
              </div>
              <form onSubmit={handleSaveBanner} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">عنوان البنر *</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                    required
                    data-testid="input-banner-title"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">النص الفرعي</label>
                  <input
                    type="text"
                    value={bannerForm.subtitle}
                    onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                    data-testid="input-banner-subtitle"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">نص زر الإجراء</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText}
                    onChange={e => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                    data-testid="input-banner-cta"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadField
                    label="صورة البنر"
                    note="اختر صورة من هاتفك أو الصق رابط URL"
                    accept="image/*"
                    currentValue={bannerForm.imageUrl}
                    onChange={val => setBannerForm({ ...bannerForm, imageUrl: val })}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Video size={14} className="text-muted-foreground" />
                      <label className="block text-sm text-muted-foreground">فيديو البنر (يأخذ الأولوية على الصورة)</label>
                    </div>
                    <p className="text-xs text-muted-foreground/70 mb-2">اختر فيديو من هاتفك أو الصق رابط URL</p>
                    <FileUploadField
                      label=""
                      accept="video/*"
                      currentValue={bannerForm.videoUrl}
                      onChange={val => setBannerForm({ ...bannerForm, videoUrl: val })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
                    data-testid="button-save-banner"
                  >
                    حفظ البنر
                  </button>
                  {bannerToast && (
                    <span className="text-emerald-500 font-semibold text-sm">تم الحفظ بنجاح</span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ── Products Tab ── */}
          {activeTab === 'products' && (
            <div>
              {!editingProduct ? (
                <>
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-bold">المنتجات ({products.length})</h3>
                    <button
                      onClick={() => setEditingProduct({ currency: 'IQD', stockStatus: 'in_stock', stockLabel: 'متوفر', isFeatured: false, isBestSelling: false, category: 'cpus', imageUrl: '', specs: '', badge: '' })}
                      className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 active:scale-95 transition-all text-sm"
                      data-testid="button-add-product"
                    >
                      <Plus size={16} /> إضافة منتج
                    </button>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block bg-card border border-border rounded-xl overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead className="bg-muted border-b border-border text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-semibold">اسم المنتج</th>
                          <th className="px-4 py-3 font-semibold">الفئة</th>
                          <th className="px-4 py-3 font-semibold">السعر (د.ع)</th>
                          <th className="px-4 py-3 font-semibold">المخزون</th>
                          <th className="px-4 py-3 font-semibold text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                            <td className="px-4 py-3 font-medium max-w-[220px]">
                              <div className="truncate">{p.title}</div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {CATEGORIES.find(c => c.slug === p.category)?.name || p.category}
                            </td>
                            <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">
                              {p.price.toLocaleString('ar-IQ')}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                p.stockStatus === 'in_stock' ? 'bg-emerald-500/20 text-emerald-400'
                                : p.stockStatus === 'out_of_stock' ? 'bg-red-500/20 text-red-400'
                                : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {STOCK_LABELS[p.stockStatus]}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-secondary/20 hover:bg-secondary/40 text-white rounded-lg transition-colors text-xs font-medium"
                                  data-testid={`button-edit-${p.id}`}
                                >
                                  <Edit size={14} /> تعديل
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors text-xs font-medium"
                                  data-testid={`button-delete-${p.id}`}
                                >
                                  <Trash2 size={14} /> حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {products.length === 0 && (
                      <div className="py-12 text-center text-muted-foreground">لا توجد منتجات بعد</div>
                    )}
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden flex flex-col gap-3">
                    {products.length === 0 && (
                      <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-xl">لا توجد منتجات بعد</div>
                    )}
                    {products.map(p => (
                      <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                        {/* Product Info */}
                        <div className="flex items-start gap-3">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.title} className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-border" />
                          ) : (
                            <div className="w-14 h-14 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center border border-border">
                              <ImageIcon size={20} className="text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-sm leading-snug mb-1 line-clamp-2">{p.title}</p>
                            <p className="text-xs text-muted-foreground mb-1">
                              {CATEGORIES.find(c => c.slug === p.category)?.name || p.category}
                            </p>
                            <p className="text-primary font-black text-base">
                              {p.price.toLocaleString('ar-IQ')} <span className="text-xs font-normal text-primary/70">د.ع</span>
                            </p>
                          </div>
                          <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                            p.stockStatus === 'in_stock' ? 'bg-emerald-500/20 text-emerald-400'
                            : p.stockStatus === 'out_of_stock' ? 'bg-red-500/20 text-red-400'
                            : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {STOCK_LABELS[p.stockStatus]}
                          </span>
                        </div>

                        {/* Action Buttons — full width, easy to tap */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="flex items-center justify-center gap-2 py-2.5 bg-secondary/20 hover:bg-secondary/40 text-white rounded-lg transition-colors font-semibold text-sm"
                            data-testid={`button-edit-mobile-${p.id}`}
                          >
                            <Edit size={15} /> تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="flex items-center justify-center gap-2 py-2.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors font-semibold text-sm"
                            data-testid={`button-delete-mobile-${p.id}`}
                          >
                            <Trash2 size={15} /> حذف
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* ── Add / Edit Form ── */
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-lg font-bold mb-5">
                    {editingProduct.id ? 'تعديل منتج' : 'إضافة منتج جديد'}
                  </h3>
                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="col-span-1 md:col-span-2 md:col-span-1">
                      <label className="block text-sm text-muted-foreground mb-1">اسم المنتج *</label>
                      <input
                        type="text"
                        value={editingProduct.title || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                        required
                        data-testid="input-product-title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">السعر (د.ع) *</label>
                      <input
                        type="number"
                        value={editingProduct.price || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                        required
                        min="0"
                        data-testid="input-product-price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">الفئة</label>
                      <select
                        value={editingProduct.category || 'cpus'}
                        onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                        data-testid="select-product-category"
                      >
                        {CATEGORIES.filter(c => c.slug !== 'best_selling').map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">حالة المخزون</label>
                      <select
                        value={editingProduct.stockStatus || 'in_stock'}
                        onChange={e => setEditingProduct({ ...editingProduct, stockStatus: e.target.value as Product['stockStatus'] })}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                        data-testid="select-product-stock"
                      >
                        <option value="in_stock">متوفر</option>
                        <option value="low_stock">باقي قليل</option>
                        <option value="out_of_stock">نفذ من المخزون</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">تفاصيل المخزون</label>
                      <input
                        type="text"
                        value={editingProduct.stockLabel || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, stockLabel: e.target.value })}
                        placeholder="مثال: باقي قطعتان فقط"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                        data-testid="input-product-stock-label"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">الشارة (Badge)</label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        placeholder="مثال: جديد، خصم 20%"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                        data-testid="input-product-badge"
                      />
                    </div>

                    {/* Image Upload — full width */}
                    <div className="col-span-1 md:col-span-2">
                      <FileUploadField
                        label="صورة المنتج"
                        note="اختر صورة من هاتفك مباشرة، أو الصق رابط URL"
                        accept="image/*,video/*"
                        currentValue={editingProduct.imageUrl || ''}
                        onChange={val => setEditingProduct({ ...editingProduct, imageUrl: val })}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-1">المواصفات التفصيلية</label>
                      <textarea
                        value={editingProduct.specs || ''}
                        onChange={e => setEditingProduct({ ...editingProduct, specs: e.target.value })}
                        rows={3}
                        placeholder="مثال: المعالج: Intel i9 | الرام: 32GB | الكرت: RTX 4090"
                        className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none resize-none text-sm"
                        data-testid="input-product-specs"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center gap-6 py-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingProduct.isFeatured || false}
                          onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                          className="w-4 h-4 accent-primary"
                          data-testid="checkbox-featured"
                        />
                        <span className="text-sm font-medium">منتج مميز (التجميعات)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingProduct.isBestSelling || false}
                          onChange={e => setEditingProduct({ ...editingProduct, isBestSelling: e.target.checked })}
                          className="w-4 h-4 accent-primary"
                          data-testid="checkbox-best-selling"
                        />
                        <span className="text-sm font-medium">الأكثر مبيعاً</span>
                      </label>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition-all"
                        data-testid="button-save-product"
                      >
                        حفظ المنتج
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="sm:w-32 bg-muted text-white font-bold py-3 rounded-lg hover:bg-border transition-colors"
                        data-testid="button-cancel-product"
                      >
                        إلغاء
                      </button>
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
