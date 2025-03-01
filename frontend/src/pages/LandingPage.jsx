import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from './components/footer';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Data banner untuk carousel
  const banners = [
    {
      id: 1,
      title: 'Konser Spektakuler 2025',
      subtitle: 'Rasakan getaran musik dari artis lokal dan internasional di Semarang',
      image: 'https://pict.sindonews.net/dyn/1280/salsabila/photo/2023/08/27/5/49467/warnawarni-semarang-merdeka-flower-festival-iao.JPG',
      link: '/event/1',
      className: 'from-pink-900/80 via-pink-700/60 to-transparent',
    },
    {
      id: 2,
      title: 'Festival Kuliner Semarang',
      subtitle: 'Cicipi kelezatan kuliner autentik dari penjuru kota',
      image: 'https://assets.ladiestory.id/gallery/16775524112067579013-feast.jpg',
      link: '/event/2',
      className: 'from-orange-900/70 via-orange-600/50 to-transparent',
    },
    {
      id: 3,
      title: 'Seminar Inovasi Teknologi',
      subtitle: 'Pelajari tren terbaru dari para ahli teknologi terkemuka',
      image: 'https://studiopelangi.id/wp-content/uploads/2019/10/Pict-30.jpeg',
      link: '/event/3',
      className: 'from-blue-900/80 via-blue-700/60 to-transparent',
    },
    {
      id: 4,
      title: 'Olahraga Marathon Semarang',
      subtitle: 'Ikuti lomba lari terbesar di kota bersama ribuan pelari',
      image: 'https://imgcdn.espos.id/@espos/images/2024/12/20241215155520-lari-semarang-10k-2.jpg',
      link: '/event/4',
      className: 'from-green-900/80 via-green-700/60 to-transparent',
    },
  ];

  // Auto slideshow untuk carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Mock data kategori
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Data testimoni
  const testimonials = [
    {
      id: 1,
      name: 'Budi Santoso',
      role: 'Pengunjung Event',
      text: 'DolanTix membuat hidup saya lebih mudah! Tiket event favorit langsung di tangan tanpa ribet.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      name: 'Dewi Lestari',
      role: 'Event Organizer',
      text: 'Platform ini luar biasa untuk mengelola tiket dan menjangkau lebih banyak audiens.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 3,
      name: 'Andi Wijaya',
      role: 'Pengusaha Lokal',
      text: 'Promosi event jadi lebih efektif berkat DolanTix. Sangat recommended!',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
  ];

  // Fungsi untuk scroll ke section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Tutup menu mobile setelah klik
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 overflow-x-hidden">
      {/* Header/Navbar */}
      <header className="bg-white shadow-lg fixed top-0 w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-3xl font-extrabold text-blue-600 hover:text-blue-800 transition-colors duration-200">
                Dolan<span className="text-orange-500">Tix</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('fitur')}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Fitur
              </button>
              <button
                onClick={() => scrollToSection('categories')}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Kategori
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Tentang Kami
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
              >
                Kontak
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 font-medium px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Masuk</Link>
              <Link to="/register" className="bg-blue-600 text-white font-medium px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md">Daftar</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg animate-slide-down">
            <nav className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-md transition-colors duration-200 w-full text-left"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('fitur')}
                className="block px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 w-full text-left"
              >
                Fitur
              </button>
              <button
                onClick={() => scrollToSection('categories')}
                className="block px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 w-full text-left"
              >
                Kategori
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 w-full text-left"
              >
                Tentang Kami
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200 w-full text-left"
              >
                Kontak
              </button>
              <Link to="/login" className="block px-3 py-2 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200">Masuk</Link>
              <Link to="/register" className="block px-3 py-2 text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200">Daftar</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section / Carousel */}
      <section className="relative h-[70vh] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              backgroundImage: `url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.className} flex items-center justify-center text-center`}>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-lg">{banner.title}</h1>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md">{banner.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-orange-500 w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="fitur" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in">Mengapa DolanTix?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 animate-fade-in-delay">Platform terbaik untuk menemukan dan memesan tiket event di Semarang.</p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-delay">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proses Cepat</h3>
              <p className="text-gray-600">Dapatkan tiket Anda dalam hitungan detik dengan sistem yang efisien.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-delay">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keamanan Terjamin</h3>
              <p className="text-gray-600">Transaksi Anda dilindungi dengan teknologi enkripsi canggih.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-delay">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pembayaran Fleksibel</h3>
              <p className="text-gray-600">Beragam opsi pembayaran untuk kenyamanan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in">Kategori Event</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 animate-fade-in-delay">Jelajahi berbagai kategori acara yang sesuai dengan minat Anda.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Olahraga', 'Festival', 'Konser', 'Seminar'].map((cat, index) => (
              <div key={index} className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-delay">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl group-hover:bg-orange-500 transition-colors duration-300">
                  {cat === 'Olahraga' ? '🏆' : cat === 'Festival' ? '🎭' : cat === 'Konser' ? '🎵' : '📚'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{cat}</h3>
                <p className="text-gray-600">{cat === 'Olahraga' ? 'Kompetisi dan Turnamen' : cat === 'Festival' ? 'Kuliner dan Budaya' : cat === 'Konser' ? 'Musik dan Seni' : 'Edukasi dan Workshop'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" alt="About DolanTix" className="rounded-2xl shadow-xl w-full h-auto" />
            </div>
            <div className="animate-fade-in-delay">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Tentang DolanTix</h2>
              <p className="text-lg text-gray-600 mb-4">DolanTix adalah platform e-ticketing terpercaya di Semarang yang menghubungkan Anda dengan berbagai event menarik, dari olahraga hingga seminar.</p>
              <p className="text-lg text-gray-600 mb-6">Dengan teknologi canggih dan antarmuka yang ramah pengguna, kami memastikan pengalaman pemesanan tiket yang seamless dan menyenangkan.</p>
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">100+</p>
                  <p className="text-gray-600">Event</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">10K+</p>
                  <p className="text-gray-600">Pengguna</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">50+</p>
                  <p className="text-gray-600">Partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 animate-fade-in">Apa Kata Mereka?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 animate-fade-in-delay">Dengarkan pengalaman pengguna kami.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-delay">
                <img src={testimonial.avatar} alt={testimonial.name} className="h-16 w-16 rounded-full mx-auto mb-4" />
                <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold mb-4 animate-fade-in">Siap Menjelajahi Semarang?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto animate-fade-in-delay">Gabung sekarang dan nikmati event terbaik di kota Anda!</p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105">
              Daftar Sekarang
            </Link>
            <Link to="/login" className="border-2 border-white hover:bg-white hover:text-blue-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg">
              Lihat Event
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;