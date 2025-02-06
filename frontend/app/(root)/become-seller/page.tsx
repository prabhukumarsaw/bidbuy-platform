'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import BecomeSupplierButton from './become-seller';

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: 'How do I register as a seller on the platform?',
    answer:
      'To register as a seller, sign up for a user account and complete the "Become a Seller" form under your account settings. Once submitted, our team will review your application and notify you upon approval.',
  },
  {
    question: 'What types of items can I sell on the platform?',
    answer:
      'You can sell a wide variety of items, including collectibles, electronics, fashion, home goods, and more. Certain categories may have specific guidelines, so please review our terms before listing.',
  },
  {
    question: 'How does the bidding process work?',
    answer:
      'Buyers place bids on listed items during the auction period. The highest bid at the end of the auction wins. Sellers are notified immediately after the auction concludes to finalize the transaction.',
  },
  {
    question: 'What fees are associated with selling?',
    answer:
      'Our platform charges a small commission on successful sales. Additional fees may apply for premium listing options or promotional tools. Check our fee structure in the seller dashboard for more details.',
  },
  {
    question: 'How do I ensure safe transactions?',
    answer:
      'Our platform uses secure payment gateways and provides escrow services to protect both buyers and sellers. Funds are released to sellers once the transaction is confirmed by the buyer.',
  },
  {
    question: 'Are there any tools to help me promote my listings?',
    answer:
      'Yes, we offer several promotional tools, including featured listings, social media sharing options, and targeted advertising to boost visibility and attract more buyers.',
  },
  {
    question: 'What happens if there is a dispute between a buyer and seller?',
    answer:
      'Our dedicated support team helps resolve disputes by reviewing evidence provided by both parties. We aim to ensure fair outcomes in accordance with our dispute resolution policy.',
  },
  {
    question: 'Can I participate in auctions as both a buyer and a seller?',
    answer:
      'Absolutely! You can register as a buyer and later apply to become a seller. Once approved, you can manage your auctions while bidding on other items simultaneously.',
  },
];

export default function SellerFeature() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section with Video Background */}
      <motion.div className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute w-auto min-w-full min-h-full max-w-none"
        >
          <source src="/video.webm" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
          >
            Join Us as a Seller
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-md md:text-lg mb-8 text-gray-300"
          >
            Unlock the power of our auction platform to reach a global audience.
            Showcase your products, connect with buyers, and maximize your
            earnings—all in one place. Join a thriving community of sellers
            today!
          </motion.p>
          <blockquote className="my-6 italic text-lg text-gray-500 md:text-xl lg:text-2xl">
            "Opportunities don't happen. You create them."
            <span className="block mt-2 font-medium text-gray-700">
              — Chris Grosser
            </span>
          </blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-x-4"
          >
            <BecomeSupplierButton />
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-10 w-10 text-blue-400" />
        </motion.div>
      </motion.div>

      {/* About Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
          >
            Connecting People, Unlocking Opportunities
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-lg mb-6">
                Welcome to [Your Auction Platform], the ultimate destination for
                buyers and sellers to connect and thrive. Our mission is to
                empower sellers to showcase their products and help buyers
                discover unique items through seamless and transparent auctions.
              </p>
              <BecomeSupplierButton />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="bg-gray-700 border-blue-500 border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-blue-400">
                    10,000+
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Active Users</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-teal-500 border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-teal-400">
                    500+
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Successful Auctions</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-purple-500 border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-purple-400">
                    90%
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Customer Satisfaction</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-700 border-pink-500 border">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-pink-400">
                    5000+
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Bids Placed</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
          >
            Frequently Asked Questions
          </motion.h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
