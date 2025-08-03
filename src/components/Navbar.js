import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, BarChart2 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', icon: Home, path: '/' },
    { name: 'Calculadora', icon: BookOpen, path: '/calculator' },
    { name: 'Historial', icon: BarChart2, path: '/history' },
  ];

  return (
    <motion.nav
      className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-full px-6 py-3 shadow-lg fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.5 }}
    >
      <ul className="flex space-x-6">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link to={item.path} className="flex flex-col items-center group">
              <motion.div
                className={`p-2 rounded-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gray-700 text-white shadow-md'
                    : 'text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span
                className={`text-xs font-medium mt-1 transition-all duration-300 ${
                  location.pathname === item.path ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-600'
                }`}
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default Navbar;