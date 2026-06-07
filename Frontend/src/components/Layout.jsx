import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-grid">
      <Navbar />
      <main className="flex-grow max-w-[92vw] 2xl:max-w-[1536px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-start">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
