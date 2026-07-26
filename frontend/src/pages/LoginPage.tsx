import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { sendOtp, verifyOtp, getMe } from '../api'
import { useAuthStore } from '../store/useAuthStore'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^09[0-9]{9}$/.test(phone)) {
      toast.error('شماره موبایل نادرست است')
      return
    }
    setLoading(true)
    try {
      await sendOtp(phone)
      toast.success('کد تأیید ارسال شد')
      setStep('otp')
    } catch {
      toast.error('خطا در ارسال کد')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await verifyOtp(phone, code)
      setToken(res.data.token)
      const userRes = await getMe()
      setUser(userRes.data)
      toast.success('ورود موفق')
      navigate(userRes.data.role === 'ADMIN' ? '/admin' : '/')
    } catch {
      toast.error('کد نادرست یا منقضی شده')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛍️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('login')}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {step === 'phone' ? 'شماره موبایل خود را وارد کنید' : `کد ارسال شده به ${phone} را وارد کنید`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone')}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xxxxxxxxx"
                  className="input text-center tracking-widest"
                  dir="ltr"
                  maxLength={11}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? t('loading') : t('sendOtp')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('otpCode')}</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="------"
                  className="input text-center tracking-[0.5em] text-2xl font-bold"
                  dir="ltr"
                  maxLength={6}
                  autoFocus
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? t('loading') : t('verify')}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-gray-500 hover:text-primary-500 transition-colors"
              >
                تغییر شماره
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
