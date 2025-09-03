import { useContext } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/helpers/format_currency";

import { CartContext } from "../contexts/cart";
import CartProductItem from "./cart_product_item";

const CartSheet = () => {
    const { isOpen, toggleCart, products, total } = useContext(CartContext);

    return (
        <Sheet open={isOpen} onOpenChange={toggleCart}>
            <SheetTrigger>Open</SheetTrigger>
            <SheetContent className="w-[80%]">
                <SheetHeader>
                    <SheetTitle className="text-left">Sacola</SheetTitle>
                </SheetHeader>
                <div className="py-5 flex h-full flex-col">
                    <div className="flex-auto">
                        {products.map((product) => (
                            <CartProductItem key={product.id} product={product} />
                        ))}
                    </div>
                    <Card className="mb-6">
                        <CardContent className="p-5">
                            <div className="flex justify-between">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-sm font-semibold">{formatCurrency(total)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Button className="w-full rounded-full">Finalizar pedido</Button>
                </div>
            </SheetContent>
        </Sheet >
    );
};

export default CartSheet;
