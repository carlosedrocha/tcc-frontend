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
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../ui/use-toast';

// Define the new schema
const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(3, { message: 'Password must be at least 3 characters' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  cpf: z.string().min(1, { message: 'CPF is required' }),
  roleId: z.coerce.number().min(1, { message: 'Role is required' })
});

type EmployeeFormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  initialData: any | null;
}

// todo fix this Interface
interface IRole {
  id: number | string;
  name: string;
}

export enum rolesEnum {
  WAITER = 'Waiter'
}

export const translatedRolesEnum = {
  [rolesEnum.WAITER]: 'Garçom'
  // [rolesEnum.ADMIN]: 'Administrador',
  // [rolesEnum.USER]: 'Usuário',
  // [rolesEnum.MANAGER]: 'Gerente',
};

const useEmployeeData = (id) => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<IRole[]>([]);
  const [employeeData, setEmployeeData] = useState();
  const initialDataRef = useRef(null);

  useEffect(() => {
    const fetchCurrentEmployee = async () => {
      try {
        if (!id) {
          return;
        }
        const response = await api.get(`employee/${id}`);
        const data = response.data;
        initialDataRef.current = {
          email: data.user.email || '',
          password: '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          cpf: data.cpf || '',
          roleId: data.user.role.id || null
        };
        setEmployeeData(initialDataRef.current);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao buscar dados do funcionário',
          description:
            'Houve um problema ao buscar os dados, tente novamente mais tarde.'
        });
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await api.get('role');
        setRoles(response.data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Falha ao buscar cargos.',
          description: 'Houve um erro ao buscar os cargos, tente novamente.'
        });
      }
    };

    fetchRoles();
    fetchCurrentEmployee();
  }, [id, toast]);

  return { roles, employeeData };
};

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [roles, setRoles] = useState<IRole[]>([]);

  const id = params['employeeId'] === 'new' ? null : params['employeeId'];

  const { roles, employeeData } = useEmployeeData(id);
  initialData = employeeData ? employeeData : initialData;

  const title = initialData ? 'Editar Funcionário' : 'Adicionar Funcionário';
  const description = initialData
    ? 'Editar o Funcionário.'
    : 'Adicionar Funcionário';
  const toastMessage = initialData
    ? 'Funcionário Atualizado.'
    : 'Funcionário Criado.';
  const action = initialData ? 'Salvar' : 'Criar';
  1;
  const defaultValues = initialData
    ? initialData
    : {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        cpf: '',
        roleId: null
      };

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues
  });

  useEffect(() => {
    if (employeeData) {
      form.reset(employeeData);
    }
  }, [employeeData, form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      setLoading(true);
      if (id) {
        await api.put(`/employee/${id}`, data);
      } else {
        const res = await api.post(`/employee`, data);
        // console.log("employee", res);
      }
      router.refresh();
      router.push(`/dashboard/employee`);
      toast({
        title: toastMessage
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Algo deu errado',
        description: 'Houve um problema com a solicitação, tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/employees/${params.employeeId}`);
      router.refresh();
      router.push(`/${params.storeId}/employees`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="John"
                      defaultValue={field.value}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Doe"
                      defaultValue={field.value}
                      {...field}
                    />
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
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="CPF"
                      defaultValue={field.value}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="john@doe.com"
                      defaultValue={field.value}
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
                      disabled={loading}
                      placeholder="..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select
                    disabled={loading}
                    value={field.value?.toString() || ''}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value?.toString()}
                          placeholder="Selecione"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {translatedRolesEnum[role.name] || role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
