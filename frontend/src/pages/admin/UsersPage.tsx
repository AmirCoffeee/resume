import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminGetUsers, adminUpdateUserRole } from '../../api'
import type { User, Page } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'
import Pagination from '../../components/Pagination'

export default function AdminUsersPage() {
  const [data, setData] = useState<Page<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const load = () => {
    setLoading(true)
    adminGetUsers(page, 20).then((r) => setData(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await adminUpdateUserRole(userId, role)
      toast.success('نقش به‌روز شد')
      load()
    } catch { toast.error('خطا') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">کاربران</h1>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">شماره</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">نام</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">ایمیل</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">نقش</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">تاریخ عضویت</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3" dir="ltr">{u.phone}</td>
                    <td className="px-4 py-3">
                      {u.firstName ? `${u.firstName} ${u.lastName || ''}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500" dir="ltr">{u.email || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border border-gray-200 cursor-pointer ${
                          u.role === 'ADMIN' ? 'text-primary-600 bg-primary-50' : 'text-gray-600 bg-gray-50'
                        }`}
                      >
                        <option value="USER">کاربر</option>
                        <option value="ADMIN">ادمین</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  )
}
