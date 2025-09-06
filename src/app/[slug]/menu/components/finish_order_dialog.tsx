"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { ConsumptionMethod } from '@prisma/client';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2Icon } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { z } from 'zod';

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { createOrder } from '../actions/create_order';
import { createStripeCheckout } from '../actions/create_stripe_checkout';
import { CartContext } from '../contexts/cart';
import { isValidCpf } from '../helpers/cpf';

const formSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Nome é obrigatório.',
    }),
    email: z.email({
        message: 'Email inválido.',
    }).trim(),
    cpf: z.string()
        .min(1, { message: 'CPF é obrigatório.' })
        .refine((value) => isValidCpf(value), {
            message: 'CPF inválido.',
        }),
})

type FormSchema = z.infer<typeof formSchema>
interface FinishOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
    const { slug } = useParams<{ slug: string }>();
    const { products } = useContext(CartContext);
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
        },
        shouldUnregister: true,
    })
    const onSubmit = async (data: FormSchema) => {
        try {
            setIsLoading(true);
            const consumptionMethod = searchParams.get("consumptionMethod") as ConsumptionMethod;

            const order = await createOrder({
                consumptionMethod,
                customerCpf: data.cpf,
                customerEmail: data.email,
                customerName: data.name,
                products,
                slug
            })
            const { sessionId } = await createStripeCheckout({
                products,
                orderId: order.id,
                slug,
                consumptionMethod,
                cpf: data.cpf
            })
            if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) return;
            const stripe = await loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
            );
            stripe?.redirectToCheckout({
                sessionId: sessionId,
            })
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Finalizar pedido</DrawerTitle>
                    <DrawerDescription>Insira suas informações para finalizar o pedido</DrawerDescription>
                </DrawerHeader>
                <div className='px-5'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Seu nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite seu nome" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite seu email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cpf</FormLabel>
                                        <FormControl>
                                            <PatternFormat placeholder='Digite seu cpf...' {...field} format='###.###.###-##' customInput={Input} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DrawerFooter>
                                <Button disabled={isLoading} type='submit' variant="destructive" className='rounded-full'>
                                    {isLoading && <Loader2Icon className='animate-spin' />}
                                    Finalizar
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" className='w-full rounded-full'>Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
                </div>

            </DrawerContent>
        </Drawer>
    );
}

export default FinishOrderDialog;