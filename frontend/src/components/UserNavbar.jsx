import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-md w-full fixed top-0 left-0 z-10 py-5">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo Dolantix */}
          <Link to="/dashboard" className="text-2xl font-bold">
            Dolan<span className="text-orange-400">Tix</span>
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden md:flex space-x-6 text-lg">
            <li>
              <Link to="/dashboard" className="hover:bg-blue-700 hover:text-gray-300 px-4 py-2 rounded-md">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:bg-blue-700 hover:text-gray-300 px-4 py-2 rounded-md">
                Lihat Pesanan
              </Link>
            </li>
          </ul>

          {/* Logout Button */}
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white shadow-md"
            onClick={() => setShowModal(true)}
          >
            Logout
          </button>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Modal Logout */}
      {showModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
          style={{ width: "100vw", height: "100vh" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center z-50">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Logout</h2>
            <p className="text-gray-700 mb-4">Apakah kamu yakin ingin logout?</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
                Batal
              </button>
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserNavbar;
