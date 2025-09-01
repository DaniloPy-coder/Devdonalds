import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import ConsuptionMethodOption from "./components/consuption-method-option";

interface RestaurantPageprops {
  params: Promise<{ slug: string }>;
}

const RestaurantPage = async ({ params }: RestaurantPageprops) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug } });
  if (!restaurant) return notFound();
  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
      <div className="flex flex-col items-center gap-2">
        <Image
          src={restaurant?.avatarImageUrl}
          alt={restaurant?.name}
          width={82}
          height={82}
        />
        <h2 className="font-semibold">{restaurant?.name}</h2>
      </div>

      <div className="space-y-2 pt-24 text-center">
        <h3 className="text-2xl font-semibold">Seja bem vindo!</h3>
        <p className="opacity-55">
          Escolha como prefere aproveitar sua refeição
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-14">
        <ConsuptionMethodOption
          buttonText="Para comer aqui"
          imageAlt="Comer aqui"
          imageUrl="/Dine_in.png"
          option="DINE_IN"
          slug={slug}
        />
        <ConsuptionMethodOption
          buttonText="Para levar"
          imageAlt="levar"
          imageUrl="/takeaway.png"
          option="TAKE_AWAY"
          slug={slug}
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
