'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { CategoryNav } from './category-nav';

const Header = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll down
        setVisible(false);
      } else {
        // Scroll up
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-background transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <Navbar />
      </header>

      <CategoryNav />
    </>
  );
};

export default Header;
