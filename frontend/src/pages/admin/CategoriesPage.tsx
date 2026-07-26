import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md'
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../api'
import type { Category } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'

const empty: Partial<Category> = { nameFA: '', nameEN: '', slug: '', icon: '', sortOrder: 0, active: true }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Category>>(empty)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetCategories().then((r) => setCategories(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing.nameFA) { toast.error('نام فارسی الزامی است'); return }
    setSaving(true)
    try {
      if (editing.id) await adminUpdateCategory(editing.id, editing)
      else await adminCreateCategory(editing)
      toast.success('ذخیره شد')
      setModal(false)
      load()
    } catch { toast.error('خطا') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('حذف شود؟')) return
    await adminDeleteCategory(id)
    toast.success('حذف شد')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">دسته‌بندی‌ها</h1>
        <button onClick={() => { setEditing({ ...empty }); setModal(true) }} className="btn-primary flex items-center gap-2">
          <MdAdd size={20} /> افزودن
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-gray-600">آیکون</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">نام فارسی</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">نام انگلیسی</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">ترتیب</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">وضعیت</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-2xl">{c.icon || '—'}</td>
                  <td className="px-4 py-3 font-medium">{c.nameFA}</td>
                  <td className="px-4 py-3 text-gray-500" dir="ltr">{c.nameEN}</td>
                  <td className="px-4 py-3">{c.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setEditing({ ...c }); setModal(true) }} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><MdEdit size={18} /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><MdDelete size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-semibold">{editing.id ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی'}</h2>
                <button onClick={() => setModal(false)}><MdClose /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">نام فارسی *</label>
                  <input className="input" value={editing.nameFA || ''} onChange={(e) => setEditing({ ...editing, nameFA: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">نام انگلیسی</label>
                  <input className="input" dir="ltr" value={editing.nameEN || ''} onChange={(e) => setEditing({ ...editing, nameEN: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">آیکون (emoji)</label>
                    <input className="input text-2xl" value={editing.icon || ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">ترتیب نمایش</label>
                    <input type="number" className="input" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
                  </div>
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
