import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdClose } from 'react-icons/md'
import {
  adminGetProducts, adminCreateProduct, adminUpdateProduct,
  adminDeleteProduct, adminGetCategories, adminUploadFile
} from '../../api'
import type { Product, Category, Page } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'
import Pagination from '../../components/Pagination'

const emptyProduct: Partial<Product> = {
  nameFA: '', nameEN: '', descriptionFA: '', descriptionEN: '',
  price: 0, discountPrice: undefined, stock: 0,
  images: [], active: true, featured: false,
}

export default function AdminProductsPage() {
  const [data, setData] = useState<Page<Product> | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Product>>(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = () => {
    setLoading(true)
    adminGetProducts(page, 20).then((r) => setData(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])
  useEffect(() => { adminGetCategories().then((r) => setCategories(r.data)).catch(() => {}) }, [])

  const openCreate = () => { setEditing({ ...emptyProduct }); setModal(true) }
  const openEdit = (p: Product) => { setEditing({ ...p }); setModal(true) }

  const handleDelete = async (id: number) => {
    if (!confirm('آیا مطمئنید؟')) return
    await adminDeleteProduct(id)
    toast.success('محصول حذف شد')
    load()
  }

  const handleSave = async () => {
    if (!editing.nameFA || !editing.price) { toast.error('نام و قیمت الزامی است'); return }
    setSaving(true)
    try {
      if (editing.id) await adminUpdateProduct(editing.id, editing)
      else await adminCreateProduct(editing)
      toast.success('ذخیره شد')
      setModal(false)
      load()
    } catch { toast.error('خطا در ذخیره') }
    finally { setSaving(false) }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await adminUploadFile(file)
      setEditing((prev) => ({ ...prev, images: [...(prev.images || []), res.data.url] }))
    } catch { toast.error('خطا در آپلود') }
    finally { setUploading(false) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">محصولات</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <MdAdd size={20} /> افزودن محصول
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">نام</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">قیمت</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">موجودی</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">وضعیت</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] && <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                        <div>
                          <div className="font-medium text-gray-900">{p.nameFA}</div>
                          <div className="text-xs text-gray-400">{p.nameEN}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{p.price.toLocaleString('fa-IR')}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.active ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><MdEdit size={18} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><MdDelete size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold">{editing.id ? 'ویرایش محصول' : 'افزودن محصول'}</h2>
                <button onClick={() => setModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><MdClose size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">نام فارسی *</label>
                    <input className="input" value={editing.nameFA || ''} onChange={(e) => setEditing({ ...editing, nameFA: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">نام انگلیسی</label>
                    <input className="input" dir="ltr" value={editing.nameEN || ''} onChange={(e) => setEditing({ ...editing, nameEN: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">قیمت *</label>
                    <input type="number" className="input" value={editing.price || ''} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">قیمت تخفیف</label>
                    <input type="number" className="input" value={editing.discountPrice || ''} onChange={(e) => setEditing({ ...editing, discountPrice: Number(e.target.value) || undefined })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">موجودی</label>
                    <input type="number" className="input" value={editing.stock || 0} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">دسته‌بندی</label>
                  <select className="input" value={editing.category?.id || ''} onChange={(e) => {
                    const cat = categories.find((c) => c.id === Number(e.target.value))
                    setEditing({ ...editing, category: cat })
                  }}>
                    <option value="">بدون دسته‌بندی</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.nameFA}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">توضیحات فارسی</label>
                  <textarea className="input resize-none" rows={3} value={editing.descriptionFA || ''} onChange={(e) => setEditing({ ...editing, descriptionFA: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">تصاویر</label>
                  <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
                  {uploading && <span className="text-xs text-gray-400 mr-2">در حال آپلود...</span>}
                  {editing.images && editing.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {editing.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img src={img} className="w-16 h-16 rounded-lg object-cover" alt="" />
                          <button onClick={() => setEditing({ ...editing, images: editing.images!.filter((_, j) => j !== i) })}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="rounded accent-primary-500" />
                    فعال
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="rounded accent-primary-500" />
                    ویژه
                  </label>
                </div>
              </div>
              <div className="flex gap-3 p-6 pt-0">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'در حال ذخیره...' : 'ذخیره'}</button>
                <button onClick={() => setModal(false)} className="btn-outline flex-1">انصراف</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
