export interface NavLink {
  name: string;
  path: string;
  showIn: ('navbar' | 'footer')[];
}

export const siteLinks: NavLink[] = [
  // Tautan yang hanya muncul di Navbar
  { name: 'Beranda', path: '/', showIn: ['navbar'] },
  { name: 'Opini', path: '/opini', showIn: ['navbar'] },
  { name: 'Analisis', path: '/analisis', showIn: ['navbar'] },

  // Tautan yang muncul di Footer (di bawah "Informasi")
  { name: 'Tentang Kami', path: '/tentang', showIn: ['footer'] },
  { name: 'Redaksi', path: '/redaksi', showIn: ['footer'] },
  { name: 'Olahraga', path: '/olahraga', showIn: ['footer'] }, // Contoh dari Anda

  // Tautan yang hanya muncul di Navbar (seperti halaman statis baru)
  { name: 'dfdsfdfgdfg', path: '/halaman-statis-1', showIn: ['navbar'] },
  { name: 'dsfdfgdf', path: '/halaman-statis-2', showIn: ['navbar'] },
  { name: 'Login Redaksi', path: '/login', showIn: ['navbar'] },
];