import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ProductHeader from "./components/product_header";

interface ProductPageProps {
    params: Promise<{
        slug: string;
        productId: string;
    }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
    const { slug, productId } = await params;
    const product = await db.product.findUnique({
        where: {
            id: productId
        },
        include: {
            restaurant: {
                select: {
                    name: true,
                    avatarImageUrl: true,
                    slug: true
                }
            }
        }
    });

    if (!product) {
        notFound();
    }
    if (product.restaurant.slug.toUpperCase() !== slug.toUpperCase()) {
        return notFound();
    }

    return (
        <div className="flex h-full flex-col">
            <ProductHeader product={product} />
        </div>
    )
};

export default ProductPage;
