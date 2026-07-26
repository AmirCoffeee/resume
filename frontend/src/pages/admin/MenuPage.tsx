import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdClose, MdDragIndicator } from 'react-icons/md'
import { adminGetMenu, adminCreateMenuItem, adminUpdateMenuItem, adminDeleteMenuItem } from '../../api'
import type { MenuItem } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'

const empty: Partial<MenuItem> = {
  titleFA: '', titleEN: '', url: '/', icon: '',
  sortOrder: 0, active: true, location: 'HEADER'
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<MenuItem>>(empty)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetMenu().then((r) => setItems(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!editing.titleFA || !editing.url) { toast.error('عنوان و لینک الزامی است'); return }
    setSaving(true)
    try {
      if (editing.id) await adminUpdateMenuItem(editing.id, editing)
      else await adminCreateMenuItem(editing)
      toast.success('ذخیره شد')
      setModal(false)
      load()
    } catch { toast.error('خطا') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('حذف شود؟')) return
    await adminDeleteMenuItem(id)
    toast.success('حذف شد')
    load()
  }

  const locationLabel = (loc: string) => ({ HEADER: 'هدر', FOOTER: 'فوتر', SIDEBAR: 'سایدبار' }[loc] || loc)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت منو</h1>
        <button onClick={() => { setEditing({ ...empty }); setModal(true) }} className="btn-primary flex items-center gap-2">
          <MdAdd size={20} /> افزودن آیتم
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-gray-600">عنوان</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">لینک</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">موقعیت</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">ترتیب</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">وضعیت</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.icon && <span>{item.icon}</span>}
                      <div>
                        <div className="font-medium">{item.titleFA}</div>
                        <div className="text-xs text-gray-400" dir="ltr">{item.titleEN}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs" dir="ltr">{item.url}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-blue-50 text-blue-600">{locationLabel(item.location)}</span>
                  </td>
                  <td className="px-4 py-3">{item.sortOrder}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setEditing({ ...item }); setModal(true) }} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><MdEdit size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><MdDelete size={18} /></button>
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
                <h2 className="font-semibold">{editing.id ? 'ویرایش آیتم منو' : 'افزودن آیتم منو'}</h2>
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
                <div>
                  <label className="block text-sm font-medium mb-1.5">لینک *</label>
                  <input className="input" dir="ltr" value={editing.url || '/'} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">آیکون</label>
                    <input className="input" value={editing.icon || ''} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="emoji یا نام آیکون" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">موقعیت</label>
                    <select className="input" value={editing.location || 'HEADER'} onChange={(e) => setEditing({ ...editing, location: e.target.value as MenuItem['location'] })}>
                      <option value="HEADER">هدر</option>
                      <option value="FOOTER">فوتر</option>
                      <option value="SIDEBAR">سایدبار</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ترتیب نمایش</label>
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
