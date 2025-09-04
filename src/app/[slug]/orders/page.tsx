import { db } from "@/lib/prisma";

import { isValidCpf, removeCpfPontuation } from "../menu/helpers/cpf";
import CpfForm from "./components/cpf_form";
import OrderList from "./components/order_list";

const OrdersPage = async ({
    searchParams,
}: {
    searchParams?: Record<string, string | undefined>;
}) => {
    const cpf = searchParams?.cpf;

    if (!cpf || !isValidCpf(cpf)) {
        return <CpfForm />
    }

    const orders = await db.order.findMany({
        orderBy: {
            createdAt: 'desc'
        },
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