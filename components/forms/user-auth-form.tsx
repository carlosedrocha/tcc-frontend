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
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(3, { message: 'Password must be at least 3 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook de navegação

  const defaultValues = {
    email: 'admin@admin.com',
    password: '123'
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
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

        <Button disabled={loading} className="ml-auto w-full" type="submit">
          Realizar Login
        </Button>

        {/* Segundo botão para redirecionamento */}
        <Button
          disabled={loading}
          className="ml-auto w-full"
          onClick={() => router.push('/client_form')} // Redireciona para /client_form
        >
          Redirecionar para o Formulário
        </Button>
      </form>
    </Form>
  );
}
