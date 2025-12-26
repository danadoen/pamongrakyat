import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchPages, deletePage } from '../../services/newsService';
import { Page } from '../../types';
import { Edit, Trash2, Plus, ExternalLink } from 'lucide-react';

const PageList: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);

  const load = async () => {
    const data = await fetchPages();
    setPages(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus halaman ini?')) {
      await deletePage(id);
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Halaman Statis</h2>
        <Link to="/admin/pages/new" className="bg-ink text-paper px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
          <Plus size={18} />
          Buat Halaman
        </Link>
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-600">Judul Halaman</th>
              <th className="p-4 font-bold text-gray-600">URL Slug</th>
              <th className="p-4 font-bold text-gray-600">Status</th>
              <th className="p-4 font-bold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pages.map(page => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="p-4 font-serif text-lg font-medium text-ink">{page.title}</td>
                <td className="p-4 font-mono text-gray-500">/page/{page.slug}</td>
                <td className="p-4">
                    {page.isActive 
                        ? <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">Aktif</span>
                        : <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-bold">Draft</span>
                    }
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link to={`/page/${page.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gray-600 rounded"><ExternalLink size={16}/></Link>
                  <Link to={`/admin/pages/edit/${page.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></Link>
                  <button onClick={() => handleDelete(page.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 italic">Tidak ada halaman.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default PageList;