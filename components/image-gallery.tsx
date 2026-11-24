"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
    images: string[]
    productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const unique = Array.from(new Set(images.filter(Boolean)))
    const [selected, setSelected] = useState(0)

    if (unique.length === 0) {
        return <div className="aspect-[4/5] rounded-2xl bg-muted" />
    }

    return (
        <div className="flex flex-col-reverse gap-4 md:flex-row">
            {unique.length > 1 && (
                <ul className="flex gap-3 md:w-20 md:flex-col" aria-label="Product photos">
                    {unique.map((image, index) => (
                        <li key={image} className="w-20 shrink-0">
                            <button
                                type="button"
                                onClick={() => setSelected(index)}
                                aria-label={`Show photo ${index + 1} of ${unique.length}`}
                                aria-current={selected === index}
                                className={cn(
                                    "relative block aspect-square w-full overflow-hidden rounded-lg bg-muted ring-offset-2 ring-offset-background transition",
                                    selected === index ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100",
                                )}
                            >
                                <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-muted">
                <Image
                    src={unique[selected] || "/placeholder.svg"}
                    alt={unique.length > 1 ? `${productName}, photo ${selected + 1} of ${unique.length}` : productName}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    )
}
