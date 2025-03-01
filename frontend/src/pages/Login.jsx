import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Mencoba login:', { identifier, password });
      const res = await axios.post('/api/auth/login', { identifier, password });
      console.log('Respon dari server:', res.data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      
      console.log('LocalStorage diset:', {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        username: localStorage.getItem('username'),
      });

      // Tambah delay kecil untuk pastikan Local Storage sinkron
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Gagal login:', err.response?.status, err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login gagal. Silakan periksa kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Illustration and Message */}
        <div className="w-full md:w-1/2 bg-blue-600 p-8 relative">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600">
                  <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
                  <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 005.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104.75.75 0 00-1.23.262l-1.752 4.54a.75.75 0 00.037.699l1.68 3.36a.75.75 0 00.728.41h.993a.75.75 0 00.65-.336l.47-.78a7.5 7.5 0 00.532-8.53" />
                </svg>
              </div>
              <div className="ml-3 text-2xl font-bold text-white">
                Dolan<span className="text-orange-400">Tix</span>
              </div>
            </div>
            
            {/* Main Illustration */}
            <div className="mb-8 text-center">
              <div className="inline-block relative">
                <div className="h-40 w-40 rounded-full bg-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Local Landmark Illustration */}
                <svg width="220" height="220" viewBox="0 0 220 220" className="relative z-10">
                  <g fill="white">
                    {/* Simplified Lawang Sewu Building */}
                    <rect x="70" y="120" width="80" height="60" />
                    <polygon points="50,120 170,120 160,100 60,100" />
                    <rect x="85" y="130" width="15" height="25" />
                    <rect x="120" y="130" width="15" height="25" />
                    <rect x="102" y="160" width="15" height="20" />
                    
                    {/* Clock Tower */}
                    <rect x="95" y="70" width="30" height="30" />
                    <polygon points="90,70 130,70 110,50" />
                    <circle cx="110" cy="85" r="10" stroke="#4299e1" fill="none" strokeWidth="2" />
                    <line x1="110" y1="85" x2="110" y2="78" stroke="#4299e1" strokeWidth="2" />
                    <line x1="110" y1="85" x2="115" y2="85" stroke="#4299e1" strokeWidth="2" />
                  </g>
                </svg>
              </div>
            </div>
            
            {/* Tagline */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Jelajahi Semarang</h1>
              <p className="text-blue-100 mb-4">Temukan dan booking tiket acara terbaik di Kota Semarang</p>
              
              {/* Decorative Elements */}
              <div className="flex justify-center space-x-2">
                <div className="h-1 w-12 bg-orange-400 rounded-full"></div>
                <div className="h-1 w-6 bg-blue-300 rounded-full"></div>
                <div className="h-1 w-3 bg-blue-300 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-blue-300"></div>
            <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-blue-300"></div>
            <div className="absolute top-1/2 left-1/3 h-16 w-16 rounded-full bg-blue-200"></div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Selamat Datang</h2>
          
          {error && (
            <div className="mb-6 p-3 rounded bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                Email atau Username
              </label>
              <input
                id="identifier"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Masukkan email atau username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Lupa Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Ingat saya
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum Terdaftar?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Buat akun
              </Link>
            </p>
          </div>
          
          <div className="text-center mt-8 text-xs text-gray-500">
            <p>© 2025 DolanTix. Semua hak dilindungi.</p>
            <div className="mt-2 space-x-4">
              <Link to="/privacy" className="hover:text-gray-700">Kebijakan Privasi</Link>
              <Link to="/terms" className="hover:text-gray-700">Syarat & Ketentuan</Link>
              <Link to="/help" className="hover:text-gray-700">Bantuan</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;