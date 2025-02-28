import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Animation effect on scroll
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-element');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top <= window.innerHeight * 0.8;
        if (isInViewport) {
          el.classList.add('visible');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              Dolan<span className="text-orange-500">Tix</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#events" className="text-gray-600 hover:text-blue-600 transition">Event</a>
            <a href="#categories" className="text-gray-600 hover:text-blue-600 transition">Kategori</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">Tentang</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Kontak</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-lg transition transform hover:scale-105"
            >
              Login
            </Link>
            <button className="md:hidden text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-5 z-0">
          <div className="absolute w-96 h-96 bg-orange-500 rounded-full -top-20 -right-20 opacity-20"></div>
          <div className="absolute w-64 h-64 bg-blue-500 rounded-full top-40 left-20 opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-1">
          <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Temukan Event Terbaik di <span className="text-blue-600">Semarang</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Beli tiket untuk berbagai acara di Semarang seperti olahraga, festival, konser, dan seminar dengan mudah dan cepat.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
            Jelajahi Event
            </Link>
              <a href="#categories" className="bg-white hover:bg-gray-100 text-blue-600 text-lg font-medium px-8 py-3 rounded-full shadow-lg border border-blue-200 transition transform hover:scale-105">
                Lihat Kategori
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </section>

      {/* Category Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in-element">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kategori Event</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Pilih kategori event favorit Anda dan temukan berbagai pilihan acara menarik di Semarang.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 fade-in-element">
            <div className="bg-blue-50 rounded-xl p-6 text-center hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900">Olahraga</h3>
              <p className="text-gray-600 mt-2">Pertandingan, turnamen, dan kompetisi</p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 text-center hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white">🎭</div>
              <h3 className="text-xl font-semibold text-gray-900">Festival</h3>
              <p className="text-gray-600 mt-2">Budaya, kuliner, dan seni</p>
            </div>
            
            <div className="bg-pink-50 rounded-xl p-6 text-center hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white">🎵</div>
              <h3 className="text-xl font-semibold text-gray-900">Konser</h3>
              <p className="text-gray-600 mt-2">Musik, teater, dan pertunjukan</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 text-center hover:shadow-lg transition transform hover:scale-105 cursor-pointer">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-white">📚</div>
              <h3 className="text-xl font-semibold text-gray-900">Seminar</h3>
              <p className="text-gray-600 mt-2">Workshop, pelatihan, dan webinar</p>
            </div>
          </div>
        </div>
      </section>

     

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 fade-in-element">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src="/api/placeholder/600/400" alt="About DolantTix" className="w-full h-auto" />
              </div>
            </div>
            
            <div className="md:w-1/2 fade-in-element">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tentang DolantTix</h2>
              <p className="text-gray-600 mb-4">
                DolantTix adalah platform e-ticketing terdepan di Semarang yang menyediakan layanan pembelian tiket untuk berbagai acara seperti olahraga, festival, konser, dan seminar.
              </p>
              <p className="text-gray-600 mb-4">
                Dengan DolantTix, Anda dapat dengan mudah menemukan dan membeli tiket untuk acara-acara menarik di Semarang. Kami berkomitmen untuk memberikan pengalaman pembelian tiket yang aman, mudah, dan nyaman.
              </p>
              <p className="text-gray-600 mb-6">
                Bergabunglah dengan ribuan pengguna lainnya dan nikmati kemudahan mendapatkan tiket acara favorit Anda!
              </p>
              
              <div className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-blue-600">100+</div>
                  <div className="text-gray-600">Event</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className="text-gray-600">Pengguna</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-gray-600">Partner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in-element">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Apa Kata Mereka</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Testimoni dari pengguna yang telah menggunakan layanan DolantTix.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-in-element">
            {Array(3).fill().map((_, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <img src="/api/placeholder/100/100" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Nama Pengguna</h4>
                    <div className="flex text-yellow-400">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"Testimonial tentang pengalaman menggunakan DolantTix. Platform yang sangat memudahkan untuk membeli tiket acara di Semarang."</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-in-element">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Mulai Jelajahi Event Sekarang</h2>
            <p className="text-blue-100 mb-8 text-lg">Buat akun dan temukan berbagai event menarik di Semarang. Dapatkan update terbaru langsung ke email Anda.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link 
                to="/login" 
                className="bg-white hover:bg-gray-100 text-blue-600 text-lg font-medium px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
              >
                Daftar Sekarang
              </Link>
              <a 
                href="#events" 
                className="bg-transparent hover:bg-blue-700 text-white text-lg font-medium px-8 py-3 rounded-full border border-white shadow-lg transition transform hover:scale-105"
              >
                Lihat Event
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">Dolan<span className="text-orange-500">Tix</span></div>
              <p className="text-gray-400 mb-4">Platform e-ticketing terdepan di Semarang untuk berbagai acara seperti olahraga, festival, konser, dan seminar.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kategori</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Olahraga</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Festival</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Konser</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Seminar</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">Jl. Pemuda No. 123, Semarang</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">info@dolantix.com</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-400">+62 123 4567 890</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Langganan</h3>
              <p className="text-gray-400 mb-4">Dapatkan informasi terbaru tentang event di Semarang.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DolantTix. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        .fade-in-element {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-in-element.visible {
            opacity: 1;
            transform: translateY(0);
          }
          
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
                `}</style>
                
                {/* Back to top button */}
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                  className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition transform hover:scale-110 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            );
          };
          
          export default LandingPage;