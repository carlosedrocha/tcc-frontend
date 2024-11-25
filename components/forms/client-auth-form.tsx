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

// Schema de validação ajustado para o DTO
const formSchema = z.object({
  email: z.string().email({ message: 'Digite um email válido' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
  firstName: z.string().min(1, { message: 'O primeiro nome é obrigatório' }),
  lastName: z.string().min(1, { message: 'O sobrenome é obrigatório' }),
  cpf: z
    .string()
    .optional()
    .refine((cpf) => !cpf || validateCpf(cpf), {
      message: 'CPF inválido'
    })
});

// Função para validar o CPF usando o algoritmo oficial
function validateCpf(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf)) return false; // Deve conter exatamente 11 dígitos
  const digits = cpf.split('').map(Number);

  // Verificar se todos os números são iguais (exemplo: 111.111.111-11)
  if (digits.every((digit) => digit === digits[0])) return false;

  // Calcular o primeiro dígito verificador
  const calcVerifier = (factor: number) =>
    digits
      .slice(0, factor - 1)
      .reduce((sum, num, idx) => sum + num * (factor - idx), 0) % 11;

  const firstVerifier = (11 - calcVerifier(10)) % 10;
  if (firstVerifier !== digits[9]) return false;

  // Calcular o segundo dígito verificador
  const secondVerifier = (11 - calcVerifier(11)) % 10;
  return secondVerifier === digits[10];
}



type UserFormValue = z.infer<typeof formSchema>;

export default function ClientAuthForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook de navegação

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      cpf: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    localStorage.clear();
    sessionStorage.clear();
    try {
      setLoading(true);
      const response = await api.post('auth/customer/local/signup', data);
      if (response.status === 200) {
        const { user } = response.data;
        const { id: userId, email, entity } = user;
        const { firstName, lastName } = entity;

        const userData = {
          userId,
          name: `${firstName} ${lastName}`,
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

  // Função para formatar o CPF
  function formatCpf(value: string) {
    // Remove todos os caracteres não numéricos
    const digits = value.replace(/\D/g, '');
    // Aplica a máscara
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
  }

  // Função para remover a máscara
  function unmaskCpf(value: string) {
    return value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* Campos Nome e Sobrenome lado a lado */}
        <div className="flex space-x-4">
          {/* Campo Primeiro Nome */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Primeiro Nome</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Digite seu primeiro nome..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo Sobrenome */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Digite seu sobrenome..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                  placeholder="Digite seu CPF..."
                  disabled={loading}
                  value={formatCpf(field.value)} // Formata enquanto o usuário digita
                  onChange={(e) => field.onChange(unmaskCpf(e.target.value))} // Remove a máscara antes de enviar ao Zod
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
