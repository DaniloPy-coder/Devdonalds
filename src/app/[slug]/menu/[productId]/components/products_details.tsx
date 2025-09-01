"use client";

import { Prisma } from "@prisma/client";
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format_currency";

interface ProductDetailProps {
    product: Prisma.ProductGetPayload<{
        include: {
            restaurant: {
                select: {
                    name: true;
                    avatarImageUrl: true;
                };
            };
        };
    }>;
}

const ProductDetails = ({ product }: ProductDetailProps) => {
    const [quantity, setQuantity] = useState<number>(1);
    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="relative z-50 flex-col flex mt-[-1.5rem] flex-auto rounded-t-3xl px-5 py-5">
            <div className="flex-auto">
                {/* Restaurante */}
                <div className="flex items-center gap-1">
                    <Image
                        src={product.restaurant.avatarImageUrl}
                        alt={product.restaurant.name}
                        width={16}
                        height={16}
                        className="rounded-full"
                    />
                    <p className="text-xs text-muted-foreground">
                        {product.restaurant.name}
                    </p>
                </div>

                {/* Preço e Produto */}
                <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>

                {/* Preço e Quantidade */}
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                        {formatCurrency(product.price)}
                    </h3>
                    <div className="flex items-center gap-3 text-center">
                        <Button
                            variant="outline"
                            onClick={handleDecreaseQuantity}
                            className="h-8 w-8 rounded-xl"
                        >
                            <ChevronLeftIcon />
                        </Button>
                        <p className="w-4">{quantity}</p>
                        <Button
                            variant="destructive"
                            onClick={handleIncreaseQuantity}
                            className="h-8 w-8 rounded-xl"
                        >
                            <ChevronRightIcon />
                        </Button>
                    </div>
                </div>

                {/* Sobre */}
                <div className="mt-6 space-y-3">
                    <h4 className="font-semibold">Sobre</h4>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>

                {/* Ingredientes */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-1.5">
                        <ChefHatIcon size={18} />
                        <h4 className="font-semibold">Ingredientes</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
            </div>

            <Button className="mt-6 w-full rounded-full">Adicionar à sacola</Button>
        </div>
    );
};

export default ProductDetails;
