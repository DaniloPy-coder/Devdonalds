import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantsMenuPageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        consumptionMethod?: string;
    }>;
}


// apenas uma definição da função
const isConsumptionMethodValid = (consumptionMethod?: string) => {
    if (!consumptionMethod) return false;
    return ["DINE_IN", "TAKE_AWAY"].includes(consumptionMethod.toUpperCase());
};

const RestaurantsMenuPage = async ({ params, searchParams }: RestaurantsMenuPageProps) => {
    const { slug } = await params;
    const { consumptionMethod } = await searchParams;

    // valida antes de buscar o restaurante
    if (!isConsumptionMethodValid(consumptionMethod)) {
        return notFound();
    }

    const restaurant = await db.restaurant.findUnique({
        where: { slug }, include: {
            menuCategories: {
                include: { products: true }
            }
        },
    });

    if (!restaurant) {
        return notFound();
    }

    return (
        <div>
            <RestaurantHeader restaurant={restaurant} />
            <RestaurantCategories restaurant={restaurant} />
        </div>
    );
};

export default RestaurantsMenuPage;
