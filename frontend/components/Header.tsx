'use client';

import React from 'react';
import Navbar from './Navbar';
import CategoryNavPage from './category-nav';

const Header = () => {
  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-background transition-transform duration-300 `}
      >
        <Navbar />
      </header>

      <CategoryNavPage />
    </>
  );
};

export default Header;
