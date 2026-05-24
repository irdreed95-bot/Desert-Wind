import { useState, useEffect } from 'react';
import { X, User, Eye, EyeOff } from 'lucide-react';
import { ADMIN_MASTER_KEY } from '../config';

interface LoginModalProps {
  onClose: () => void;
  onAdminGranted: () => void;
}

export function LoginModal({ onClose, onAdminGranted }: LoginModalProps) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake]       = useState(false);
  const [feedback, setFeedback] = useState('');

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ── Secret admin path ──────────────────────────────────────────────────
    // When both fields exactly match the master key, grant admin silently.
    if (email === ADMIN_MASTER_KEY && password === ADMIN_MASTER_KEY) {
      onAdminGranted();
      onClose();
      return;
    }

    // ── Regular login (no backend — just cosmetic feedback) ────────────────
    if (!email.trim() || !password.trim()) {
      triggerShake('يرجى تعبئة جميع الحقول.');
      return;
    }
    // Simulate a "wrong credentials" response for normal users
    triggerShake('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
  };

  const triggerShake = (msg: string) => {
    setFeedback(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative bg-card border rounded-2xl w-full max-w-sm shadow-2xl shadow-primary/10 transition-colors ${
          shake ? 'border-red-500 animate-shake' : 'border-border'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-muted"
          aria-label="إغلاق"
        >
          <X size={18} />
        </button>

        <div className="p-8 flex flex-col items-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-5">
            <User size={26} className="text-primary" />
          </div>

          <h2 className="text-2xl font-black text-white mb-1">تسجيل الدخول</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            أدخل بياناتك للدخول إلى حسابك
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Email / Username */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="text"
                value={email}
                onChange={e => { setEmail(e.target.value); setFeedback(''); }}
                placeholder="example@email.com"
                dir="ltr"
                autoComplete="username"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                data-testid="input-login-email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setFeedback(''); }}
                  placeholder="••••••••"
                  dir="ltr"
                  autoComplete="current-password"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  data-testid="input-login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error feedback */}
            {feedback && (
              <p className="text-red-400 text-xs text-center font-semibold -mt-1">
                {feedback}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-black py-3 rounded-lg hover:bg-primary/90 active:scale-95 transition-all mt-1"
              data-testid="button-login-submit"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
