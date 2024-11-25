'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const isValidCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, ''); // Remove qualquer caractere não numérico

  if (cleanCPF.length !== 11) return false; // CPF deve ter 11 dígitos

  // Valida se o CPF não é um número repetido como 111.111.111-11
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Cálculo do primeiro dígito verificador
  const firstDigit = calculateCPFCheckDigit(cleanCPF, 9);
  // Cálculo do segundo dígito verificador
  const secondDigit = calculateCPFCheckDigit(cleanCPF, 10);

  return cleanCPF[9] === firstDigit && cleanCPF[10] === secondDigit;
};

// Função para calcular o dígito verificador do CPF
const calculateCPFCheckDigit = (cpf: string, length: number) => {
  let sum = 0;
  let weight = length + 1;

  for (let i = 0; i < length; i++) {
    sum += parseInt(cpf.charAt(i)) * weight--;
  }

  const remainder = sum % 11;
  if (remainder < 2) return '0';
  return (11 - remainder).toString();
};

const formSchema = z.object({
  name_3044216164: z.string().min(1, 'Nome é obrigatório'),
  name_0302858434: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine((value) => isValidCPF(value), 'CPF inválido'),
  name_2571447054: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  name_9010524744: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to submit the form. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <FormField
          control={form.control}
          name="name_3044216164"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormDescription>Nome completo é obrigatório.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_0302858434"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="CPF" {...field} maxLength={11} />
              </FormControl>
              <FormDescription>
                CPF é obrigatório e deve ter 11 dígitos válidos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_2571447054"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="E-mail" type="email" {...field} />
              </FormControl>
              <FormDescription>
                E-mail é obrigatório e deve ser válido.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_9010524744"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Senha" type="password" {...field} />
              </FormControl>
              <FormDescription>
                A senha deve ter pelo menos 6 caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
}
