'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heading } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [name, setName] = useState('');
  const [comandNumber, setComandNumber] = useState('');
  const [savedCards, setSavedCards] = useState([]);

  // Carregar dados salvos localmente ao iniciar
  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
    setSavedCards(savedCards);
    setCardCount(savedCards.length);
  }, []);

  const handleAddCard = () => {
    setCardCount(cardCount + 1);
    const newCard = { number: comandNumber, name: name };
    setSavedCards([...savedCards, newCard]);
    localStorage.setItem('savedCards', JSON.stringify([...savedCards, newCard]));
  };

  const handleComandNumber = (event:any) => {
    setComandNumber(event.target.value);
  };

  const handleNameChange = (event:any) => {
    setName(event.target.value);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmAdd = () => {
    if (comandNumber && name) {
      handleAddCard();
      handleCloseModal();
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-start justify-between">
          <Heading
            title={`Adicionar Nova Comanda`}
            description="Adicione novas comandas e gerencie as criadas"
          />
          <Button onClick={handleOpenModal}>Adicionar Nova Comanda</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {savedCards.map((card, index) => (
            <Card key={index} className="w-[350px]">
              <CardHeader>
                <CardTitle>Comanda Nº {card.number}</CardTitle>
                <CardDescription>
                  Nome: {card.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={''}
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  Acessar pedido
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Modal para adicionar nova comanda */}
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
                <Input type='text' onChange={handleComandNumber}></Input>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Digite o nome da pessoa</Label>
                <Input type='text' onChange={handleNameChange}></Input>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmAdd}>
                  Continue
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </ScrollArea>
  );
}
