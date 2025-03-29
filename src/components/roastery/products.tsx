"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts } from "@/lib/data";
import ProductCard from './productCard'
import { IProduct } from "@/models/Product";

export default function Products() {
    const [products, setProducts]= useState<IProduct[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getAllProducts();
            setProducts(data)
        }

        loadProducts();
    }, [])

    return (
        <div className="flex flex-col space-y-6">
            {products.map((product) => <ProductCard key={product.name} product={product} />)}
        </div>
    )
}