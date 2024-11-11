'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import api from '@/app/api';

interface Track {
  id: string;
  name: string;
  albumName: string;
  durationMs: number;
  imageUrl: string;
  url: string;
}

export function QueueSoptifyTable() {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<Track[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]); // Estado para armazenar as músicas selecionadas
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Função para buscar dados a cada tecla pressionada
  const fetchData = async (query: string) => {
    if (query.length < 3) {
      setFilteredData([]); // Não exibe nada se a busca for muito curta
      setIsDropdownVisible(false);
      return;
    }

    try {
      const response = await api.get(`/spotify/search/${query}`);
      console.log('API Response:', response); // Verificando a resposta da API
      setFilteredData(response.data || []); // Ajuste conforme a resposta da API
      setIsDropdownVisible(true); // Exibe as opções se houver resultados
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setIsDropdownVisible(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    fetchData(event.target.value); // Chama a busca a cada alteração do valor
  };

  const handleSelectTrack = (track: Track) => {
    setSearchValue(''); // Limpa o campo de pesquisa
    setIsDropdownVisible(false); // Fecha o dropdown
    setSelectedTracks((prevTracks) => [...prevTracks, track]); // Adiciona a música selecionada à lista de músicas
    console.log('Track selected:', track); // Log para verificar a música selecionada
  };

  // Função para fechar o dropdown ao clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  // UseEffect para monitorar cliques fora do dropdown
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* Campo de input para pesquisa */}
      <Input
        placeholder="Pesquise sua música"
        value={searchValue}
        onChange={handleInputChange}
        className="w-full md:w-[700px]"
      />

      {/* Dropdown de sugestões */}
      {isDropdownVisible && filteredData.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border bg-zinc-950  "
        >
          {filteredData.map((track) => (
            <div
              key={track.id}
              className="cursor-pointer p-2 hover:bg-gray-50"
              onClick={() => handleSelectTrack(track)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={track.imageUrl}
                  alt={track.name}
                  className="h-8 w-8 rounded"
                />
                <span>{track.name}</span>
                <span>{(track.durationMs / 1000 / 60).toFixed(2)} min</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabela com as músicas selecionadas */}
      <ScrollArea className="mt-4 h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead>Capa</TableHead>
              <TableHead>Músicas</TableHead>
              <TableHead>Álbum</TableHead>
              <TableHead>Duração</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedTracks.length > 0 ? (
              selectedTracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>
                    {' '}
                    <img
                      src={track.imageUrl}
                      alt={track.name}
                      className="h-12 w-12 rounded"
                    />
                  </TableCell>
                  <TableCell>{track.name}</TableCell>
                  <TableCell>{track.albumName}</TableCell>
                  <TableCell>
                    {(track.durationMs / 1000 / 60).toFixed(2)} min
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Nenhuma música selecionada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
