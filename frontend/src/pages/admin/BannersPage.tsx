import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md'
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner, adminUploadFile } from '../../api'
import type { Banner } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'

const empty: Partial<Banner> = {
  titleFA: '', titleEN: '', subtitleFA: '', subtitleEN: '',
  imageUrl: '', linkUrl: '', sortOrder: 0, active: true
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Banner>>(empty)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetBanners().then((r) => setBanners(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing.titleFA) { toast.error('عنوان الزامی است'); return }
    setSaving(true)
    try {
      if (editing.id) await adminUpdateBanner(editing.id, editing)
      else await adminCreateBanner(editing)
      toast.success('ذخیره شد')
      setModal(false)
      load()
    } catch { toast.error('خطا') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('حذف شود؟')) return
    await adminDeleteBanner(id)
    toast.success('حذف شد')
    load()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await adminUploadFile(file)
      setEditing((prev) => ({ ...prev, imageUrl: res.data.url }))
    } catch { toast.error('خطا در آپلود') }
    finally { setUploading(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">بنرها</h1>
        <button onClick={() => { setEditing({ ...empty }); setModal(true) }} className="btn-primary flex items-center gap-2">
          <MdAdd size={20} /> افزودن بنر
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="card overflow-hidden">
              {b.imageUrl && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img src={b.imageUrl} alt={b.titleFA} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{b.titleFA}</h3>
                {b.subtitleFA && <p className="text-sm text-gray-500 mt-1">{b.subtitleFA}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className={`badge ${b.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.active ? 'فعال' : 'غیرفعال'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing({ ...b }); setModal(true) }} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><MdEdit size={18} /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><MdDelete size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">بنری وجود ندارد</div>
          )}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-semibold">{editing.id ? 'ویرایش بنر' : 'افزودن بنر'}</h2>
                <button onClick={() => setModal(false)}><MdClose /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">عنوان فارسی *</label>
                    <input className="input" value={editing.titleFA || ''} onChange={(e) => setEditing({ ...editing, titleFA: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">عنوان انگلیسی</label>
                    <input className="input" dir="ltr" value={editing.titleEN || ''} onChange={(e) => setEditing({ ...editing, titleEN: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">زیرعنوان فارسی</label>
                    <input className="input" value={editing.subtitleFA || ''} onChange={(e) => setEditing({ ...editing, subtitleFA: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">زیرعنوان انگلیسی</label>
                    <input className="input" dir="ltr" value={editing.subtitleEN || ''} onChange={(e) => setEditing({ ...editing, subtitleEN: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">تصویر بنر</label>
                  <input type="file" accept="image/*" onChange={handleUpload} className="text-sm mb-2" />
                  {uploading && <span className="text-xs text-gray-400">در حال آپلود...</span>}
                  {editing.imageUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden aspect-video bg-gray-100">
                      <img src={editing.imageUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">لینک</label>
                  <input className="input" dir="ltr" value={editing.linkUrl || ''} onChange={(e) => setEditing({ ...editing, linkUrl: e.target.value })} placeholder="/products" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ترتیب</label>
                  <input type="number" className="input" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="accent-primary-500" />
                  فعال
                </label>
              </div>
              <div className="flex gap-3 p-6 pt-0">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'ذخیره...' : 'ذخیره'}</button>
                <button onClick={() => setModal(false)} className="btn-outline flex-1">انصراف</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
