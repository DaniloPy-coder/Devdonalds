import { db } from "@/lib/prisma";

import { isValidCpf, removeCpfPontuation } from "../menu/helpers/cpf";
import CpfForm from "./components/cpf_form";
import OrderList from "./components/orders_list";

interface OrdersPageProps {
    searchParams: Promise<{ cpf: string }>
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
    const { cpf } = await searchParams;
    if (!cpf) {
        <CpfForm />
    }
    if (!isValidCpf(cpf)) {
        return <CpfForm />
    }
    const orders = await db.order.findMany({
        where: {
            customerCpf: removeCpfPontuation(cpf)
        },
        include: {
            restaurant: {
                select: {
                    name: true,
                    avatarImageUrl: true
                }
            },
            orderProducts: {
                include: {
                    product: true
                }
            }
        }
    })
    return (
        <OrderList orders={orders} />
    );
}

export default OrdersPage;