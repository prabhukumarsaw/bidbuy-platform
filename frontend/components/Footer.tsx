//@typescript-eslint/no-explicit-any

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Clock10,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useInView } from 'react-intersection-observer';

const quickLinks = [
  { name: 'About Us', href: '/about/aboutUs' },
  { name: 'Terms & Conditions', href: '/about/policy' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Careers', href: '/career/currentOpenings' },
  { name: 'Blogs', href: '/blog' },
];

const departments = [
  { name: '1', href: '/departments/orthopedics' },
  { name: '2', href: '/departments/neurology' },
  { name: '3', href: '/departments/nephrology' },
  { name: '4', href: '/departments/cardiology' },
  { name: '5', href: '/departments/physiotherapy' },
  { name: '6', href: '/departments' },
];

const FooterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);

    handleResize(); // Set initial screen size
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-lg font-medium border-b-2 border-blue-400 pb-2 md:cursor-default"
      >
        {title}
        <ChevronDown
          className="h-5 w-5 md:hidden transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <AnimatePresence>
        {(isOpen || isDesktop) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 text-sm overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Footer = () => {
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-50 py-12 overflow-hidden">
      <div className="absolute inset-0 opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-blue-500/10"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FooterSection title="Contact Us">
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start space-x-2"
                  >
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-semibold">PROBID</p>
                      <p className="text-gray-600">Ranchi, Jharkhand 834001</p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start space-x-2"
                  >
                    <Phone className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-gray-600">
                        Mon to Fri : 08:30 - 18:00
                      </p>
                      <p className="font-semibold">+91 1234567890</p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start space-x-2"
                  >
                    <Mail className="h-5 w-5 text-blue-500" />
                    <p className="text-gray-600">probid@gmail.com</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-start space-x-2"
                  >
                    <Clock10 className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-gray-600">Mon-Sat 6.00 - 22.00</p>
                      <p className="text-gray-600">Sunday CLOSED</p>
                    </div>
                  </motion.div>
                </div>
              </FooterSection>

              <FooterSection title="Quick Links">
                <div className="grid grid-cols-1 gap-2">
                  {quickLinks.map((dept) => (
                    <motion.div
                      key={dept.href}
                      whileHover={{ x: 5 }}
                      className="flex items-center"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <Link
                        href={dept.href}
                        className="hover:text-blue-500 transition-colors"
                      >
                        {dept.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </FooterSection>

              <FooterSection title="Our Departments">
                <div className="grid grid-cols-1 gap-2">
                  {departments.map((dept) => (
                    <motion.div
                      key={dept.href}
                      whileHover={{ x: 5 }}
                      className="flex items-center"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                      <Link
                        href={dept.href}
                        className="hover:text-blue-500 transition-colors"
                      >
                        {dept.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </FooterSection>
            </div>

            {/* <div className="mt-8">
              <FooterSection title="Newsletter">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Your email"
                    {...register("email", { required: true })}
                    className="bg-white/50 border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                  />
                  <Textarea
                    placeholder="Your message"
                    {...register("message", { required: true })}
                    className="bg-white/50 border-rose-200 focus:border-rose-500 focus:ring-rose-500"
                  />
                  <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white transition-colors duration-300">
                    Subscribe
                  </Button>
                </form>
              </FooterSection>
            </div> */}
          </div>

          <div className="lg:col-span-1 xl:col-span-1">
            <FooterSection title="Our Location">
              <motion.div
                className={`aspect-w-16 aspect-h-9 rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${
                  mapExpanded ? 'h-[60vh]' : 'h-[30vh]'
                }`}
                layout
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m19!1m8!1m3!1d3662.1559012644075!2d85.3203445!3d23.3825767!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x39f4e1cabc58c68b%3A0xacb8529b237fb943!2sShree%20Jagannath%20Hospital%2C%20Mayor&#39;s%20Road%20-%20Booty%20Road%2C%20Radium%20Rd%2C%20behind%20Machali%20Ghar%20(Aqua%20World)%20and%20Nakshatra%20Van%2C%20Ranchi%20University%2C%20Morabadi%2C%20Ranchi%2C%20Jharkhand%20834001!3m2!1d23.3824796!2d85.32252129999999!5e0!3m2!1sen!2sin!4v1723537495368!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </motion.div>
              {/* <Button
                onClick={() => setMapExpanded(!mapExpanded)}
                className="mt-2 w-full bg-white text-rose-500 hover:bg-rose-100 transition-colors duration-300"
              >
                {mapExpanded ? 'Collapse Map' : 'Expand Map'}
              </Button> */}
            </FooterSection>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} PROBID. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                className="text-gray-600 hover:text-blue-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="h-6 w-6" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed z-50 bottom-8 right-2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
