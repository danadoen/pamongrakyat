
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { fetchArticles, deleteArticle } from '../../services/newsService';
import { Article } from '../../types';
import { Edit, Trash2, Plus } from 'lucide-react';

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
        const data = await fetchArticles();
        setArticles(data);
    } catch (err) {
        console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus berita ini? Tindakan tidak bisa dibatalkan.')) {
      try {
          // Optimistic UI update
          const previousArticles = [...articles];
          setArticles(articles.filter(a => a.id !== id));

          await deleteArticle(id);
      } catch (err: any) {
          alert('Gagal menghapus berita: ' + (err.message || 'Database error'));
          // Revert UI if failed
          load(); 
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Berita</h2>
        <Link to="/admin/articles/new" className="bg-ink text-paper px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
          <Plus size={18} />
          Tulis Berita
        </Link>
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-600">Judul</th>
              <th className="p-4 font-bold text-gray-600">Kategori</th>
              <th className="p-4 font-bold text-gray-600">Penulis</th>
              <th className="p-4 font-bold text-gray-600">Tanggal</th>
              <th className="p-4 font-bold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map(article => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{article.title}</td>
                <td className="p-4"><span className="px-2 py-1 bg-gray-200 rounded text-xs">{article.category}</span></td>
                <td className="p-4 text-gray-500">{article.author}</td>
                <td className="p-4 text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link to={`/admin/articles/edit/${article.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded block">
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => handleDelete(article.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
               <tr><td colSpan={5} className="p-8 text-center text-gray-500">
                   {loading ? 'Sedang memuat...' : 'Belum ada berita. Silakan buat baru.'}
               </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ArticleList;
