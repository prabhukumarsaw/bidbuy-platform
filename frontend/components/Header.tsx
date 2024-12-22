"use client";

import React from "react";
import Navbar from "./Navbar";
import { CategoryNav } from "./category-nav";

const Header = () => {
  return (
    <>
    <header className="sticky top-0 z-50 bg-background">
      <Navbar />
    </header>
    <CategoryNav />
    </>
    
  );
};

export default Header;

