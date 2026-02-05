"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)

    if (!images || images.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={`${productName} - Image ${selectedImage + 1}`}
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={cn(
                                "relative aspect-square overflow-hidden rounded-md border-2 transition-all",
                                selectedImage === index
                                    ? "border-primary ring-2 ring-primary ring-offset-2"
                                    : "border-transparent hover:border-muted-foreground/50",
                            )}
                        >
                            <Image src={image || "/placeholder.svg"} alt={`${productName} thumbnail ${index + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
