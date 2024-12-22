'use client'

import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from 'lucide-react'

const specialties = [
  { name: "Deals", icon: "/feature/deals.jpg", description: "Cutting-edge body enhancements" },
  { name: "News", icon: "/feature/news.jpg", description: "Bleeding-edge gadgets" },
  { name: "Car", icon: "/feature/car.jpg", description: "Digital infiltration tools" },
  { name: "Bike", icon: "/feature/bike.jpg", description: "Futuristic transportation" },
  { name: "Laptop", icon: "/feature/laptop.jpg", description: "Advanced combat gear" },
]

export function SpecialtyGrid() {
  return (
    <div className="bg-white text-blue-900 py-6 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {specialties.map((specialty, index) => (
            <SpecialtyItem key={specialty.name} specialty={specialty} index={index} />
          ))}
          {/* <ViewAllButton /> */}
        </motion.div>
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

function SpecialtyItem({ specialty, index }: { specialty: typeof specialties[0], index: number }) {
  return (
    <motion.div variants={itemVariants} custom={index}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex flex-col items-center justify-center space-y-2 p-4 hover:bg-blue-100 rounded-lg transition-all duration-300 group h-full"
            >
              <div className="relative w-12 h-12 md:w-16 md:h-16">
                <Image
                  src={specialty.icon}
                  alt={specialty.name}
                  fill
                  className="transition-transform group-hover:scale-110 object-cover rounded-full"
                />
              </div>
              <span className="font-medium text-gray-800 text-center text-sm md:text-base">{specialty.name}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{specialty.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  )
}

function ViewAllButton() {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href="/speciality/ourSpeciality"
        className="flex items-center justify-center space-x-2 p-4 hover:bg-blue-200 rounded-lg transition-all duration-300 h-full"
      >
        <span className="font-medium text-lg">View All</span>
        <ChevronRight className="h-6 w-6" />
      </Link>
    </motion.div>
  )
}

