'use client';

import api from '@/app/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  cpf: z.string().regex(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' }),
  email: z.string().email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function ClientAuthForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook de navegação

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cpf: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    localStorage.clear();
    sessionStorage.clear();
    try {
      setLoading(true);
      const response = await api.post('/auth/local/signin', data);
      if (response.status === 200) {
        const { user } = response.data;
        const { id: userId, email, entity } = user;
        const { firstName, lastName } = entity;

        const userData = {
          userId,
          name: `${firstName} ${lastName}`, // Concatena o nome completo
          email
        };

        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard'); // Redireciona para o dashboard após login bem-sucedido
      } else {
        console.error('Erro no login:', response.data);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* Campo Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite seu nome completo..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo CPF */}
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite seu CPF (somente números)..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Digite seu email..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Senha */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Digite sua senha..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Cadastro */}
        <Button disabled={loading} className="w-full" type="submit">
          {loading ? 'Carregando...' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  );
}
