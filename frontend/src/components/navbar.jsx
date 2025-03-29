import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(location.pathname);

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/admin/olahraga', name: 'Olahraga' },
    { path: '/admin/konser', name: 'Konser' },
    { path: '/admin/seminar', name: 'Seminar' },
    { path: '/admin/festival', name: 'Festival' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md w-full fixed top-0 left-0 z-10 py-5">
      <div className="container mx-auto px-6 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold">
          Dolan<span className="text-orange-400">Tix</span>
        </Link>

        <ul className="hidden md:flex space-x-6 text-lg">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`relative px-4 py-2 transition-all duration-300 rounded-md ${
                  active === item.path ? 'bg-blue-800 text-white' : 'hover:bg-blue-700 hover:text-gray-300'
                }`}
                onClick={() => setActive(item.path)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white text-xs md:text-sm"
          onClick={handleLogout}
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

      {isOpen && (
        <ul className="md:hidden bg-blue-700 text-white flex flex-col space-y-2 py-3 px-6">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="block py-2 px-4 rounded-md hover:bg-blue-800"
                onClick={() => {
                  setActive(item.path);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="bg-red-500 w-full py-2 rounded-md text-xs hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;