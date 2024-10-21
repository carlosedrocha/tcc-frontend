'use client'

import api from '@/app/api'
import { Button } from '@/components/ui/button'
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
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const defaultValues = {
    email: 'admin@admin.com',
    password: '123'
  }

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const onSubmit = async (data: UserFormValue) => {
    localStorage.clear();
    sessionStorage.clear();
    try {
      setLoading(true)
      const response = await api.post('/auth/local/signin', data)
      if (response.status === 200) {
        const { user } = response.data
        const { id: userId, email, entity } = user
        const { firstName, lastName } = entity
      
        // Criar o objeto 'user'
        const userData = {
          userId,
          name: `${firstName} ${lastName}`, // Concatena o nome completo
          email
        }
      
        // Armazenar o usuário no estado e localStorage
        localStorage.setItem('user', JSON.stringify(userData))
      
        // Redirecionar para o dashboard
        router.push('/dashboard')
        // sessionStorage.removeItem('token');
        //sessionStorage.removeItem('name');
        // sessionStorage.removeItem('userId');
        const token = response.data.bearer_token;
        //const name = response.data.user.name;
        // const userId = response.data.userId;

        // const email = response.data?.user?.email;

        // const name = `${response.data?.user?.entity?.firstName} ${response.data?.user?.entity?.lastName}`;

        const role = response.data?.user?.role?.name;

        const permissions = response.data?.user?.role?.permissions;

        sessionStorage.setItem('token', JSON.stringify(token));
        //sessionStorage.setItem('name', JSON.stringify(name));
        sessionStorage.setItem('userId', JSON.stringify(userId));
        //sessionStorage.setItem('email', JSON.stringify(data.email));
        //  sessionStorage.setItem('email', JSON.stringify(email));
        // sessionStorage.setItem('name', JSON.stringify(name));
        sessionStorage.setItem('role', JSON.stringify(role));
        sessionStorage.setItem('permissions', JSON.stringify(permissions));

        window.location.href = '/dashboard';
      }
      
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2"
      >
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
      </form>
    </Form>
  )
}