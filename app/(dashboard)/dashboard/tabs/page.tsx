'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import api from '@/app/api';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import { useRouter } from 'next/navigation';

interface TabCardData {
  id: string;
  number: string;
  name: string;
  status: string;
}

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const [comandNumber, setComandNumber] = useState('');
  const [cpf, setCpf] = useState('');
  const [tabs, setTabs] = useState<TabCardData[]>([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [idFinish, setIdFinish] = useState('');

  useEffect(() => {
    fetchTab();
  }, []);

  const fetchTab = async () => {
    try {
      const response = await api.get('/tab');
      const tabsData: TabCardData[] = response.data.map((tab: any) => ({
        id: tab.id,
        number: tab.tabNumber.toString(),
        name: tab.entity.firstName,
        status: tab.status
      }));

      // Ordenar as comandas abertas antes das fechadas
      const openTabs = tabsData.filter((tab) => tab.status === 'OPEN');
      const closedTabs = tabsData.filter((tab) => tab.status === 'CLOSED');
      const sortedTabs = [...openTabs, ...closedTabs];

      setTabs(sortedTabs);
    } catch (error) {
      console.error('Erro ao buscar comandas:', error);
    }
  };

  const handleAddCard = (id: string, status: string) => {
    const newCard = { id, number: comandNumber, name, status };
    const updatedCards = [...tabs, newCard];
    setTabs(updatedCards);
  };

  const handleComandNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComandNumber(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const validateCPF = (cpf: string) => {
    const cpfNumbers = cpf.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
    if (cpfNumbers.length !== 11) return false; // CPF deve ter 11 dígitos

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfNumbers)) return false;

    // Calcular dígitos verificadores
    const calcDigit = (cpfArray: number[], factor: number) => {
      const sum = cpfArray.reduce(
        (acc, digit, index) => acc + digit * (factor - index),
        0
      );
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const cpfArray = cpfNumbers.split('').map(Number);
    const digit1 = calcDigit(cpfArray.slice(0, 9), 10);
    const digit2 = calcDigit(cpfArray.slice(0, 10), 11);

    // Verificar se os dígitos verificadores calculados coincidem
    return cpfArray[9] === digit1 && cpfArray[10] === digit2;
  };

  const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(event.target.value);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmAdd = async () => {
    if (!validateCPF(cpf)) {
      toast({
        variant: 'destructive',
        title: 'CPF do cliente não é valido.',
        description: 'Tente novamente registrar sua comanda'
      });
    } else {
      if (comandNumber && name) {
        try {
          const response = await api.post('/tab', {
            tabNumber: parseInt(comandNumber),
            userId: JSON.parse(sessionStorage.getItem('userId') ?? ''),
            entity: {
              firstName: name,
              lastName: '',
              cpf
            }
          });
          if (response.status === 201) {
            handleAddCard(response.data.tab.id, response.data.tab.status);
            setComandNumber(''); // Limpar campo de número da comanda
            setName(''); // Limpar campo de nome
            fetchTab();
            handleCloseModal();
          } else {
            toast({
              title: 'Erro ao registrar comanda',
              description: 'Ocorreu um erro ao tentar registrar a comanda.'
            });
          }
        } catch (error) {
          console.error('Erro ao registrar comanda:', error);
          toast({
            title: 'Erro ao registrar comanda',
            description: 'Ocorreu um erro ao tentar registrar a comanda.'
          });
        }
      }
    }
  };

  const finishTab = async () => {
    try {
      setOpen(false);
      try {
        const response = await api.put(`/tab/close/${idFinish}`);
        if (response.status === 200) {
          reloadPage();
        }
      } catch (error) {
        toast({
          title: 'Erro ao finalizar comanda',
          description: 'Ocorreu um erro ao tentar finalizar a comanda.'
        });
      }
      fetchTab();
    } catch (error) {}
  };

  const handleFinishTab = (id: string) => {
    setIdFinish(id);
    setOpen(true);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const filteredTabs = tabs.filter(
    (tab) =>
      tab.number.toLowerCase().includes(filter.toLowerCase()) ||
      tab.name.toLowerCase().includes(filter.toLowerCase())
  );

  function reloadPage() {
    router.refresh();
    router.push(`/dashboard/tabs`);
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={finishTab}
        loading={false}
      />
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-start justify-between">
            <Heading
              title="Adicionar Nova Comanda"
              description="Adicione novas comandas e gerencie as criadas"
            />
            <Button onClick={handleOpenModal}>Adicionar Nova Comanda</Button>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Procure comanda pelo nome ou pelo número..."
              value={filter}
              onChange={handleFilterChange}
              className="w-full md:max-w-sm"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {filteredTabs.map((tab) => (
              <Card key={tab.id} className="w-[350px]">
                <CardHeader>
                  <CardTitle>Comanda Nº {tab.number}</CardTitle>
                  <CardDescription>Nome: {tab.name}</CardDescription>
                  <CardDescription>
                    Status: {tab.status === 'OPEN' ? 'ABERTA' : 'FECHADA'}
                    <span
                      className={cn(
                        'ml-2 inline-block h-2 w-2 rounded-full',
                        tab.status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'
                      )}
                    ></span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/dashboard/menu?tabId=${tab.id}?name=${tab.name}`}
                    className={cn(buttonVariants({ variant: 'default' }))}
                  >
                    Acessar pedido
                  </Link>
                  {tab.status === 'OPEN' && (
                    <Button
                      className="ml-10"
                      variant="destructive"
                      onClick={() => handleFinishTab(tab.id)}
                    >
                      Finalizar
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      {showModal && (
        <Modal
          title="Adicionar Nova Comanda"
          description="Preencha os campos abaixo para adicionar uma nova comanda."
          isOpen={showModal}
          onClose={handleCloseModal}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Digite o número da comanda</Label>
              <Input
                type="text"
                value={comandNumber}
                onChange={handleComandNumber}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Digite o nome do cliente</Label>
              <Input type="text" value={name} onChange={handleNameChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Digite o CPF do cliente</Label>
              <Input type="text" onChange={handleCpfChange} />
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleConfirmAdd}>Adicionar</Button>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
