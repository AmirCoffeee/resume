import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MdCheckCircle, MdCancel } from 'react-icons/md'
import api from '../api/axios'

export default function PaymentCallbackPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [refId, setRefId] = useState('')

  useEffect(() => {
    const authority = searchParams.get('Authority')
    const statusParam = searchParams.get('Status')
    const orderId = searchParams.get('orderId')

    if (statusParam === 'OK' && orderId) {
      // Verify with backend
      api.post('/payment/verify', { authority, orderId })
        .then((res) => {
          setRefId(res.data.refId || '')
          setStatus('success')
        })
        .catch(() => setStatus('failed'))
    } else {
      setStatus('failed')
    }
  }, [])

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {status === 'loading' && (
          <div className="text-gray-500">در حال بررسی پرداخت...</div>
        )}
        {status === 'success' && (
          <>
            <MdCheckCircle size={80} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('paymentSuccess')}</h1>
            {refId && <p className="text-sm text-gray-500 mb-4">کد پیگیری: {refId}</p>}
            <Link to="/orders" className="btn-primary inline-block">{t('myOrders')}</Link>
          </>
        )}
        {status === 'failed' && (
          <>
            <MdCancel size={80} className="text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('paymentFailed')}</h1>
            <p className="text-gray-500 mb-4">پرداخت انجام نشد یا لغو شد</p>
            <Link to="/cart" className="btn-primary inline-block">بازگشت به سبد خرید</Link>
          </>
        )}
      </motion.div>
    </div>
  )
}
