
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Facebook, Twitter, Instagram, Lock, Key, CloudSun, Sun, CloudRain, Cloud, MapPin, RotateCw, CloudLightning } from 'lucide-react';
import { ArticleCategory, Page, Article, AppSettings } from '../types';
import { fetchPages, fetchSettings, loginUser, fetchArticles } from '../services/newsService';

// Database Cuaca & Koordinat Kota Besar Indonesia
const INDONESIA_WEATHER = [
  { city: 'Banda Aceh', lat: 5.548, lon: 95.323, temp: '29°C', condition: 'Berawan' },
  { city: 'Medan', lat: 3.595, lon: 98.672, temp: '30°C', condition: 'Hujan Ringan' },
  { city: 'Padang', lat: -0.947, lon: 100.417, temp: '28°C', condition: 'Hujan Deras' },
  { city: 'Palembang', lat: -2.976, lon: 104.775, temp: '32°C', condition: 'Cerah' },
  { city: 'Jakarta', lat: -6.208, lon: 106.845, temp: '34°C', condition: 'Panas Terik' },
  { city: 'Bandung', lat: -6.917, lon: 107.619, temp: '24°C', condition: 'Sejuk' },
  { city: 'Yogyakarta', lat: -7.795, lon: 110.369, temp: '30°C', condition: 'Cerah Berawan' },
  { city: 'Surabaya', lat: -7.257, lon: 112.752, temp: '35°C', condition: 'Panas' },
  { city: 'Denpasar', lat: -8.670, lon: 115.212, temp: '31°C', condition: 'Cerah' },
  { city: 'Pontianak', lat: -0.026, lon: 109.342, temp: '33°C', condition: 'Berawan' },
  { city: 'Banjarmasin', lat: -3.319, lon: 114.590, temp: '30°C', condition: 'Hujan Petir' },
  { city: 'Balikpapan', lat: -1.237, lon: 116.852, temp: '31°C', condition: 'Cerah Berawan' },
  { city: 'Makassar', lat: -5.147, lon: 119.432, temp: '32°C', condition: 'Cerah' },
  { city: 'Manado', lat: 1.474, lon: 124.842, temp: '29°C', condition: 'Berawan' },
  { city: 'Ambon', lat: -3.653, lon: 128.190, temp: '28°C', condition: 'Hujan Ringan' },
  { city: 'Jayapura', lat: -2.548, lon: 140.703, temp: '30°C', condition: 'Cerah Berawan' }
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [trendingNews, setTrendingNews] = useState<Article[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  
  // Weather State
  const [weather, setWeather] = useState(INDONESIA_WEATHER[4]); // Default Jakarta
  const [isLocating, setIsLocating] = useState(true);
  const [usingLocation, setUsingLocation] = useState(false);
  
  // Login State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Helper untuk menghitung jarak (Euclidean distance sederhana untuk lat/lon)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
  };

  // Helper Icon Cuaca
  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('hujan') && c.includes('petir')) return <CloudLightning size={14} className="text-yellow-400" />;
    if (c.includes('hujan')) return <CloudRain size={14} className="text-blue-400" />;
    if (c.includes('panas') || c.includes('cerah')) return <Sun size={14} className="text-orange-400" />;
    if (c.includes('berawan') || c.includes('sejuk')) return <CloudSun size={14} className="text-gray-400" />;
    return <Cloud size={14} />;
  };

  useEffect(() => {
    const init = async () => {
      const p = await fetchPages();
      setPages(p.filter(x => x.isActive));
      
      const s = await fetchSettings();
      setSettings(s);

      // Fetch Trending News for Ticker
      const allArticles = await fetchArticles();
      // Sort by views descending, take top 5
      const sorted = allArticles.sort((a, b) => b.views - a.views).slice(0, 5);
      setTrendingNews(sorted);
    };
    init();

    // Weather Logic
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          
          let closestCity = INDONESIA_WEATHER[0];
          let minDistance = 99999;

          INDONESIA_WEATHER.forEach(city => {
            const dist = getDistance(userLat, userLon, city.lat, city.lon);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = city;
            }
          });

          setWeather(closestCity);
          setUsingLocation(true);
          setIsLocating(false);
        },
        (error) => {
          console.log("Lokasi tidak diizinkan/error, menggunakan mode rotasi.");
          startRotation();
        }
      );
    } else {
      startRotation();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRotation = () => {
    setUsingLocation(false);
    setIsLocating(false);
    let currentIndex = 0;
    const seed = new Date().getDate();
    currentIndex = seed % INDONESIA_WEATHER.length;
    setWeather(INDONESIA_WEATHER[currentIndex]);

    timerRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % INDONESIA_WEATHER.length;
      setWeather(INDONESIA_WEATHER[currentIndex]);
    }, 5000); 
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const user = await loginUser(email, password);
      if (user) {
        setIsLoginOpen(false);
        navigate('/admin');
      } else {
        setLoginError('Kredensial tidak valid. Coba email: admin@pamong.id, pass: admin123');
      }
    } catch (error) {
      setLoginError('Terjadi kesalahan.');
    }
  };

  const isActive = (path: string) => location.pathname === path ? 'border-b-2 border-ink font-bold' : '';

  const categoryLinks = [
    { name: 'Politik', path: '/kategori/Politik & Pemerintahan' },
    { name: 'Pelayanan', path: '/kategori/Pelayanan Publik' },
    { name: 'Hukum', path: '/kategori/Hukum & Keadilan' },
    { name: 'Ekonomi', path: '/kategori/Ekonomi Rakyat' },
    { name: 'Budaya', path: '/kategori/Budaya' },
    { name: 'Wisata', path: '/kategori/Destinasi Wisata' },
  ];

  const siteName = settings?.siteName || 'PamongRakyat';

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-ink selection:text-paper flex flex-col">
      
      {/* --- STICKY HEADER CONTAINER --- */}
      <div className="sticky top-0 z-50 bg-paper shadow-md border-b border-ink">
        
        {/* 1. Top Bar (Date & Weather - Single Line) */}
        <div className="bg-ink text-paper text-xs py-2 px-4 flex flex-row justify-between items-center tracking-wider uppercase font-mono h-10">
          <div className="flex gap-2 items-center whitespace-nowrap">
              <span>{today}</span>
              <span className="hidden md:inline opacity-50">|</span>
              <span className="hidden md:inline">Edisi Digital</span>
          </div>
          
          {/* Weather Widget - Always inline */}
          <div className="flex items-center gap-2 min-w-0">
              <span className="text-gray-400 hidden lg:inline text-[10px]">
                {isLocating ? '...' : (usingLocation ? 'Lokal:' : 'Nasional:')}
              </span>
              <div className={`flex items-center gap-2 font-bold transition-opacity duration-500 ${isLocating ? 'opacity-50' : 'opacity-100'} whitespace-nowrap`}>
                  {usingLocation ? <MapPin size={12} className="text-red-400 hidden sm:inline" /> : <RotateCw size={12} className="text-gray-400 animate-spin-slow hidden sm:inline" />}
                  {getWeatherIcon(weather.condition)}
                  <span className="text-accent truncate max-w-[100px] sm:max-w-none">{weather.city}, {weather.temp}</span>
                  <span className="hidden sm:inline text-gray-300 normal-case">({weather.condition})</span>
              </div>
          </div>
        </div>

        {/* 2. Branding & Controls Row (Merged Header) */}
        <div className="px-4 py-3 border-b border-ink flex justify-between items-center bg-paper relative">
          {/* Branding Left */}
          <div className="flex flex-col justify-center group cursor-pointer select-none">
             <h1 
               onDoubleClick={() => setIsLoginOpen(true)}
               className="font-serif text-3xl md:text-4xl font-black tracking-tighter leading-none group-hover:text-accent transition-colors"
               title="Double click for Admin"
             >
               <Link to="/">{siteName}</Link>
             </h1>
             <p className="font-serif italic text-xs md:text-sm text-ink-light mt-1">
               "{settings?.siteDescription || 'Suara Hati Nurani Rakyat'}"
             </p>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-4">
            {/* Search Desktop */}
            <div className="hidden md:flex relative">
                <input 
                  type="text" 
                  placeholder="Cari berita..." 
                  className="bg-transparent border-b border-ink pl-2 pr-8 py-1 focus:outline-none text-sm font-serif w-32 transition-all focus:w-48"
                />
                <Search size={16} className="absolute right-0 top-1.5 text-ink"/>
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-ink">
               {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* 3. Navigation Row */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block bg-paper border-b border-ink transition-all duration-300`}>
          <ul className="flex flex-col md:flex-row justify-center items-center text-sm uppercase tracking-widest font-bold md:divide-x divide-ink">
            <li className="w-full md:w-auto px-4 py-3 text-center border-b md:border-b-0 border-gray-200 md:border-none">
              <Link to="/" className={isActive('/') + " hover:text-accent block md:inline"}>Utama</Link>
            </li>
            {categoryLinks.map(cat => (
                <li key={cat.name} className="w-full md:w-auto px-4 py-3 text-center border-b md:border-b-0 border-gray-200 md:border-none">
                    <Link to={cat.path} className={isActive(cat.path) + " hover:text-accent block md:inline"}>{cat.name}</Link>
                </li>
            ))}
            
            {/* Dynamic Pages in Navbar - Only if showInNavbar is TRUE */}
            {pages.filter(p => p.showInNavbar).map(p => (
               <li key={p.id} className="w-full md:w-auto px-4 py-3 text-center border-b md:border-b-0 border-gray-200 md:border-none">
                   <Link to={`/page/${p.slug}`} className={isActive(`/page/${p.slug}`) + " hover:text-accent text-gray-600 block md:inline"}>
                      {p.title}
                   </Link>
               </li>
            ))}
          </ul>
        </nav>

        {/* 4. Ticker (Sekilas Info / Trending News) */}
        <div className="border-b border-ink py-1 bg-gray-100 flex items-center overflow-hidden h-8">
            <span className="bg-accent text-white px-3 h-full flex items-center text-[10px] font-bold uppercase mr-4 whitespace-nowrap z-10 shadow-sm">
              Berita Terpopuler
            </span>
            <div className="whitespace-nowrap animate-marquee text-xs font-mono flex items-center">
              {trendingNews.length > 0 ? (
                trendingNews.map((item, idx) => (
                  <Link key={item.id} to={`/berita/${item.slug}`} className="mx-4 hover:text-accent hover:underline flex items-center">
                    <span className="font-bold text-accent mr-1">+++</span> 
                    {item.title.toUpperCase()} 
                    <span className="ml-1 text-gray-500">({item.views} Pembaca)</span>
                  </Link>
                ))
              ) : (
                <span className="mx-4">+++ BELUM ADA DATA BERITA TERPOPULER +++</span>
              )}
            </div>
        </div>
      </div>
      {/* --- END STICKY HEADER --- */}

      {/* Main Content */}
      <main className="container mx-auto px-4 flex-grow pb-12 pt-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-ink text-paper py-12 border-t-8 border-double border-gray-600 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 pr-8">
            <h2 className="font-serif text-3xl font-bold mb-4 text-paper">{siteName}</h2>
            <p className="text-gray-400 max-w-md leading-relaxed mb-6 font-serif">
              Media independen yang mengawal kebijakan publik, transparansi anggaran, dan menyuarakan aspirasi masyarakat daerah untuk keadilan sosial.
            </p>
            <div className="flex gap-4 mb-4">
                 {settings?.socialFacebook && (
                    <a href={settings.socialFacebook} target="_blank" rel="noreferrer" className="w-8 h-8 bg-gray-700 flex items-center justify-center rounded-sm hover:bg-accent transition-colors"><Facebook size={16}/></a>
                 )}
                 {settings?.socialTwitter && (
                    <a href={settings.socialTwitter} target="_blank" rel="noreferrer" className="w-8 h-8 bg-gray-700 flex items-center justify-center rounded-sm hover:bg-accent transition-colors"><Twitter size={16}/></a>
                 )}
                 {settings?.socialInstagram && (
                    <a href={settings.socialInstagram} target="_blank" rel="noreferrer" className="w-8 h-8 bg-gray-700 flex items-center justify-center rounded-sm hover:bg-accent transition-colors"><Instagram size={16}/></a>
                 )}
            </div>
            <p className="text-xs text-gray-600 font-mono">
              &copy; {new Date().getFullYear()} {siteName} Media Group.
            </p>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest mb-4 border-b border-gray-600 pb-2 inline-block text-accent">Informasi</h3>
            <ul className="space-y-2 text-sm text-gray-300 font-sans">
              {/* Filter Pages for Footer Visibility */}
              {pages.filter(p => p.showInFooter).map(p => (
                  <li key={p.id}><Link to={`/page/${p.slug}`} className="hover:text-white hover:underline">{p.title}</Link></li>
              ))}
              <li><button onClick={() => setIsLoginOpen(true)} className="hover:text-white hover:underline text-left">Login Redaksi</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest mb-4 border-b border-gray-600 pb-2 inline-block text-accent">Kantor</h3>
            <ul className="space-y-2 text-sm text-gray-300 font-mono">
              {settings?.contactAddress ? (
                  settings.contactAddress.split('\n').map((line, i) => <li key={i}>{line}</li>)
              ) : (
                  <>
                    <li>Gedung Pers, Lt. 3</li>
                    <li>Jl. Kemerdekaan No. 45</li>
                    <li>Jakarta Pusat, 10110</li>
                  </>
              )}
              <li className="pt-4 text-accent">{settings?.contactEmail || 'redaksi@pamongrakyat.id'}</li>
              <li>{settings?.contactPhone || '+62 21 555-0199'}</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-paper w-full max-w-sm relative transform rotate-1 shadow-2xl border-4 border-double border-ink p-1">
              <div className="border border-ink p-6">
                 <button onClick={() => setIsLoginOpen(false)} className="absolute top-4 right-4 hover:text-red-600"><X size={24}/></button>
                 
                 <div className="text-center mb-6">
                    <h2 className="font-serif text-2xl font-bold uppercase tracking-widest border-b-2 border-ink pb-2 inline-block mb-1">Area Terbatas</h2>
                    <p className="font-mono text-xs text-gray-500">Hanya untuk personel redaksi</p>
                 </div>

                 <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                       <div className="flex items-center border-b-2 border-gray-400 focus-within:border-ink py-2">
                          <Lock size={18} className="text-gray-500 mr-2" />
                          <input 
                            type="email" 
                            placeholder="Email Redaksi" 
                            className="bg-transparent w-full focus:outline-none font-mono text-sm"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                          />
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center border-b-2 border-gray-400 focus-within:border-ink py-2">
                          <Key size={18} className="text-gray-500 mr-2" />
                          <input 
                            type="password" 
                            placeholder="Kata Sandi" 
                            className="bg-transparent w-full focus:outline-none font-mono text-sm"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                       </div>
                    </div>

                    {loginError && (
                      <div className="text-xs text-red-600 font-bold bg-red-50 p-2 border border-red-200 text-center">
                        {loginError}
                      </div>
                    )}

                    <button type="submit" className="w-full bg-ink text-paper py-3 font-bold uppercase tracking-widest hover:bg-accent transition-colors mt-4 border-2 border-transparent hover:border-ink">
                       Masuk Panel
                    </button>
                 </form>

                 <div className="mt-6 text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-mono">Sistem Keamanan PamongRakyat v1.0</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Layout;