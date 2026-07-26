import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { adminGetSettings, adminUpdateSettings, adminUploadFile } from '../../api'
import type { SiteSettings } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'

const defaultSettings: SiteSettings = {
  siteNameFA: 'فروشگاه من', siteNameEN: 'My Shop',
  primaryColor: '#FF6B35', secondaryColor: '#FFFFFF', accentColor: '#FF8C61',
  paymentGateway: 'zarinpal', paymentSandbox: true,
  freeShipping: false, freeShippingThreshold: 500000, shippingCost: 50000,
}

type TabKey = 'site' | 'theme' | 'payment' | 'shipping' | 'sms' | 'seo'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'site', label: 'اطلاعات سایت' },
  { key: 'theme', label: 'تم و رنگ' },
  { key: 'payment', label: 'درگاه پرداخت' },
  { key: 'shipping', label: 'ارسال' },
  { key: 'sms', label: 'پیامک' },
  { key: 'seo', label: 'سئو' },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('site')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    adminGetSettings()
      .then((r) => setSettings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await adminUpdateSettings(settings)
      setSettings(res.data)
      toast.success('تنظیمات ذخیره شد')
      // Apply theme immediately
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor)
    } catch { toast.error('خطا در ذخیره') }
    finally { setSaving(false) }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await adminUploadFile(file)
      setSettings({ ...settings, [field]: res.data.url })
    } catch { toast.error('خطا') }
    finally { setUploading(false) }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">تنظیمات</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'ذخیره...' : 'ذخیره تنظیمات'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <aside className="w-44 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex-1 card p-6 space-y-5">

          {activeTab === 'site' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">نام سایت (فارسی)</label>
                  <input className="input" value={settings.siteNameFA} onChange={(e) => setSettings({ ...settings, siteNameFA: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">نام سایت (انگلیسی)</label>
                  <input className="input" dir="ltr" value={settings.siteNameEN} onChange={(e) => setSettings({ ...settings, siteNameEN: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">لوگو</label>
                <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'logo')} className="text-sm" />
                {settings.logo && <img src={settings.logo} className="mt-2 h-12 object-contain" alt="logo" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">تلفن</label>
                  <input className="input" dir="ltr" value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ایمیل</label>
                  <input className="input" dir="ltr" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">تلگرام (username)</label>
                  <input className="input" dir="ltr" value={settings.telegram || ''} onChange={(e) => setSettings({ ...settings, telegram: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">اینستاگرام (username)</label>
                  <input className="input" dir="ltr" value={settings.instagram || ''} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">آدرس</label>
                <textarea className="input resize-none" rows={2} value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
              </div>
            </>
          )}

          {activeTab === 'theme' && (
            <>
              <p className="text-sm text-gray-500">تغییر رنگ‌ها بلافاصله پس از ذخیره اعمال می‌شود</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">رنگ اصلی</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                    <input className="input flex-1 font-mono text-sm" dir="ltr" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">رنگ ثانوی</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.secondaryColor} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                    <input className="input flex-1 font-mono text-sm" dir="ltr" value={settings.secondaryColor} onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">رنگ تأکیدی</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200" />
                    <input className="input flex-1 font-mono text-sm" dir="ltr" value={settings.accentColor} onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-sm font-medium mb-3 text-gray-600">پیش‌نمایش</p>
                <div className="flex gap-3 flex-wrap">
                  <button style={{ backgroundColor: settings.primaryColor }} className="text-white px-4 py-2 rounded-xl text-sm font-medium">دکمه اصلی</button>
                  <button style={{ borderColor: settings.primaryColor, color: settings.primaryColor }} className="border-2 px-4 py-2 rounded-xl text-sm font-medium">دکمه outline</button>
                  <span style={{ backgroundColor: settings.primaryColor + '20', color: settings.primaryColor }} className="px-3 py-1 rounded-full text-sm font-medium">نشان</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'payment' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1.5">درگاه پرداخت</label>
                <select className="input" value={settings.paymentGateway} onChange={(e) => setSettings({ ...settings, paymentGateway: e.target.value })}>
                  <option value="zarinpal">زرین‌پال</option>
                  <option value="idpay">آیدی‌پی</option>
                  <option value="mellat">بانک ملت</option>
                </select>
              </div>
              {settings.paymentGateway === 'zarinpal' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Merchant ID زرین‌پال</label>
                  <input className="input font-mono" dir="ltr" value={settings.zarinpalMerchantId || ''} onChange={(e) => setSettings({ ...settings, zarinpalMerchantId: e.target.value })} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                </div>
              )}
              {settings.paymentGateway === 'idpay' && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">API Key آیدی‌پی</label>
                  <input className="input font-mono" dir="ltr" value={settings.idpayApiKey || ''} onChange={(e) => setSettings({ ...settings, idpayApiKey: e.target.value })} />
                </div>
              )}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={settings.paymentSandbox} onChange={(e) => setSettings({ ...settings, paymentSandbox: e.target.checked })} className="accent-primary-500" />
                حالت تست (Sandbox)
              </label>
            </>
          )}

          {activeTab === 'shipping' && (
            <>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={settings.freeShipping} onChange={(e) => setSettings({ ...settings, freeShipping: e.target.checked })} className="accent-primary-500" />
                ارسال رایگان برای همه سفارشات
              </label>
              <div>
                <label className="block text-sm font-medium mb-1.5">حداقل سفارش برای ارسال رایگان (تومان)</label>
                <input type="number" className="input" value={settings.freeShippingThreshold} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">هزینه ارسال پیش‌فرض (تومان)</label>
                <input type="number" className="input" value={settings.shippingCost} onChange={(e) => setSettings({ ...settings, shippingCost: Number(e.target.value) })} />
              </div>
            </>
          )}

          {activeTab === 'sms' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1.5">ارائه‌دهنده پیامک</label>
                <select className="input" value={settings.smsProvider || 'kavenegar'} onChange={(e) => setSettings({ ...settings, smsProvider: e.target.value })}>
                  <option value="kavenegar">کاوه‌نگار</option>
                  <option value="ghasedak">قاصدک</option>
                  <option value="melipayamak">ملی‌پیامک</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">API Key</label>
                <input className="input font-mono" dir="ltr" value={settings.smsApiKey || ''} onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">شماره فرستنده</label>
                <input className="input" dir="ltr" value={settings.smsSender || ''} onChange={(e) => setSettings({ ...settings, smsSender: e.target.value })} />
              </div>
            </>
          )}

          {activeTab === 'seo' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1.5">توضیحات متا</label>
                <textarea className="input resize-none" rows={3} value={settings.metaDescription || ''} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">کلمات کلیدی متا</label>
                <input className="input" value={settings.metaKeywords || ''} onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })} placeholder="فروشگاه, خرید, ..." />
              </div>
            </>
          )}

        </motion.div>
      </div>
    </div>
  )
}
