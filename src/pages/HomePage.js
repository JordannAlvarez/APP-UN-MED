import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const HomePage = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl shadow-xl mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
      >
        <GraduationCap className="w-24 h-24 text-white" />
      </motion.div>

      <motion.h1
        className="text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        ¡Bienvenido!
      </motion.h1>

      <motion.p
        className="text-xl text-gray-600 max-w-2xl mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Tu asistente personal para dominar la vida universitaria.
      </motion.p>
    </motion.div>
  );
};

export default HomePage;