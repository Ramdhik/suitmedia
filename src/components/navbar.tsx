'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0); // pakai useRef agar tidak reset saat re-render
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current) {
        setShow(true);
      } else {
        setShow(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Ideas', href: '/ideas' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${show ? 'translate-y-0 bg-orange-500/90 backdrop-blur-sm' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center text-white font-bold text-lg cursor-pointer">
            <span className="bg-white text-orange-500 px-2 py-1 rounded mr-1">suit</span>media
          </div>
        </Link>

        {/* Menu */}
        <nav className="space-x-6 text-white text-sm">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <span className={`hover:underline ${pathname === item.href ? 'border-b-4 border-white pb-0.5' : ''}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
