import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { fetchUsers, saveUser, deleteUser } from '../../services/newsService';
import { User } from '../../types';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<Partial<User> | null>(null);

  const load = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing?.name || !editing?.email) return;
    await saveUser(editing as User);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus pengguna ini?')) {
      await deleteUser(id);
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
        <button onClick={() => setEditing({ role: 'editor', name: '', email: '' })} className="bg-ink text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
          <Plus size={16} /> Tambah Pengguna
        </button>
      </div>

      {editing && (
        <div className="mb-6 bg-white p-6 border border-gray-200 rounded shadow-sm">
           <h3 className="font-bold mb-4">{editing.id ? 'Edit Pengguna' : 'Pengguna Baru'}</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                value={editing.name} 
                onChange={e => setEditing({...editing, name: e.target.value})}
                className="p-2 border border-gray-300 rounded"
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={editing.email} 
                onChange={e => setEditing({...editing, email: e.target.value})}
                className="p-2 border border-gray-300 rounded"
              />
              <select 
                value={editing.role} 
                onChange={e => setEditing({...editing, role: e.target.value as any})}
                className="p-2 border border-gray-300 rounded"
              >
                 <option value="editor">Editor</option>
                 <option value="admin">Administrator</option>
              </select>
           </div>
           <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded flex items-center gap-1"><X size={16}/> Batal</button>
              <button onClick={handleSave} className="px-4 py-2 bg-accent text-white rounded hover:bg-red-800 flex items-center gap-1"><Save size={16}/> Simpan</button>
           </div>
        </div>
      )}

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-bold text-gray-600">User</th>
              <th className="p-4 font-bold text-gray-600">Role</th>
              <th className="p-4 font-bold text-gray-600">Email</th>
              <th className="p-4 font-bold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                   <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-8 h-8 rounded-full" />
                   <span className="font-medium">{user.name}</span>
                </td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{user.role}</span></td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                   <button onClick={() => setEditing(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                   <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;