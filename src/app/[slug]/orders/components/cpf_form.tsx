"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { z } from "zod"

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
} from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { isValidCpf, removeCpfPontuation } from "../../menu/helpers/cpf";

const formSchema = z.object({
    cpf: z.string()
        .min(1, { message: 'CPF é obrigatório.' })
        .refine((value) => isValidCpf(value), {
            message: 'CPF inválido.',
        }),
})

type FormSchema = z.infer<typeof formSchema>

const CpfForm = () => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
    })

    const router = useRouter()
    const pathname = usePathname

    const onSubmit = (data: FormSchema) => {
        router.push(`${pathname}?cpf=${removeCpfPontuation(data.cpf)}`)
    }

    const handleCancel = () => {
        router.back()
    }

    return (
        <Drawer open>
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Visualizar pedidos</DrawerTitle>
                    <DrawerDescription>Insira seu cpf para visualizar os pedidos</DrawerDescription>
                </DrawerHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem className="px-4">
                                    <FormLabel>Cpf</FormLabel>
                                    <FormControl>
                                        <PatternFormat placeholder='Digite seu cpf...' {...field} format='###.###.###-##' customInput={Input} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                        <DrawerFooter>
                            <Button variant="destructive" className="w-full rounded-full">Confirmar</Button>
                            <DrawerClose asChild>
                                <Button onClick={handleCancel} variant="outline" className="w-full rounded-full">Cancelar</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </form>
                </Form>
            </DrawerContent>
        </Drawer>
    );
}

export default CpfForm;