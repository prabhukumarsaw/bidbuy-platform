'use client'

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductGalleryProps {
  images: string[]
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square">
        <Image
          src={images[selectedImage]}
          alt={`Product image ${selectedImage + 1}`}
          fill
          className="object-cover rounded-lg"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button variant="outline" size="icon" onClick={prevImage}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextImage}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-4"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <div className="aspect-square relative">
              <Image
                src={images[selectedImage]}
                alt={`Product image ${selectedImage + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative aspect-square cursor-pointer rounded-lg border-2",
              selectedImage === index ? "border-primary" : "border-transparent"
            )}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

