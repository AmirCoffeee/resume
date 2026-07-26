import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { updateProfile } from '../api'
import { useAuthStore } from '../store/useAuthStore'

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, setUser } = useAuthStore()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    address: user?.address || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await updateProfile(form)
      setUser(res.data)
      toast.success(t('success'))
    } catch {
      toast.error(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('profile')}</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-600">
            {user?.firstName?.[0] || user?.phone?.[0] || '?'}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'کاربر'}
            </div>
            <div className="text-sm text-gray-500 mt-0.5" dir="ltr">{user?.phone}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('firstName')}</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('lastName')}</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label>
            <input type="email" className="input" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('address')}</label>
            <textarea className="input resize-none" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('loading') : t('save')}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
