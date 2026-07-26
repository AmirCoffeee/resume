import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../store/useSettingsStore'
import { MdPhone, MdEmail } from 'react-icons/md'
import { FaTelegram, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const settings = useSettingsStore((s) => s.settings)

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3">
            {settings ? (i18n.language === 'fa' ? settings.siteNameFA : settings.siteNameEN) : t('siteName')}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">{t('footerDesc')}</p>
          <div className="flex gap-3 mt-4">
            {settings?.telegram && (
              <a href={`https://t.me/${settings.telegram}`} target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaTelegram size={22} />
              </a>
            )}
            {settings?.instagram && (
              <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors">
                <FaInstagram size={22} />
              </a>
            )}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">{t('categories')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-primary-400 transition-colors">{t('products')}</Link></li>
            <li><Link to="/cart" className="hover:text-primary-400 transition-colors">{t('cart')}</Link></li>
            <li><Link to="/orders" className="hover:text-primary-400 transition-colors">{t('myOrders')}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">تماس با ما</h4>
          <ul className="space-y-2 text-sm">
            {settings?.phone && (
              <li className="flex items-center gap-2">
                <MdPhone size={16} className="text-primary-400" />
                <span dir="ltr">{settings.phone}</span>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2">
                <MdEmail size={16} className="text-primary-400" />
                <span>{settings.email}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        {t('copyright')} © {new Date().getFullYear()}
      </div>
    </footer>
  )
}
