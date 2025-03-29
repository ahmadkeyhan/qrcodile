"use client"
import { IProduct } from "@/models/Product"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

export default function ProductCard({product}: {product:IProduct}) {
    if (!product) return null
    return (
        <div className="flex flex-col">
            <div className="w-full">
                <Image 
                    src={product.image || "/placeholder.svg?height=250&width=500"}
                    alt={product.name}
                    width={300}
                    height={300}
                    style={{width: '100%', height: 'auto'}}
                    priority 
                />
            </div>
            <div className="flex flex-row-reverse justify-between items-center">
                <p>{product.name}</p>
                <p>{product.price}</p>
            </div>
        </div>
    )
}