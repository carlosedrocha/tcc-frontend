'use client';

import api from '@/app/api';
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/item-type-tables/columns';
import { QueueSoptifyTable } from '@/components/tables/queue-spotify/queue-spotify';
import { Button } from '@/components/ui/button'; // Importação do botão do shadcn
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface ItemTypeI {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const breadcrumbItems = [{ title: 'Itens', link: '/dashboard/item-type' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Page = ({ searchParams }: paramsProps) => {
  const [data, setData] = useState<ItemTypeI[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;

  // Função para verificar o status de autenticação
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = params.get('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setShowLoginModal(true); // Exibe o modal caso o token não esteja presente
      }
    };

    checkAuthStatus();
  }, [params]); // Dependência no params para re-executar quando os parâmetros de URL mudarem

  // Função de login do Spotify
  const handleSpotifyLogin = async () => {
    const response = await api.get('/spotify/login'); // Supondo que essa rota verifica se o usuário está logado
    console.log(response);

    // window.open(response.data);
    router.push(response.data);
  };

  const totalItems = data.length;

  return (
    <>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-border bg-popover p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground">
              Faça login com Spotify
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Para visualizar a fila de músicas, faça login na sua conta do
              Spotify.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={handleSpotifyLogin}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                Login com Spotify
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLoginModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Fila de música (${totalItems})`} description="" />
        </div>
        <Separator />

        {isLoggedIn ? (
          <QueueSoptifyTable
            searchKey="name"
            pageNo={page}
            columns={columns}
            totalItems={totalItems}
            data={data}
            pageCount={pageCount}
          />
        ) : (
          <p className="text-center text-muted-foreground">
            Faça login para ver a fila de músicas.
          </p>
        )}
      </div>
    </>
  );
};

export default Page;
