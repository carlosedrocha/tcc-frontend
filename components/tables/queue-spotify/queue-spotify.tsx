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

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Track {
  id: string;
  name: string;
  albumName: string;
  durationMs: number;
  imageUrl: string;
  url: string;
}
export interface MusicInQueue {
  id: string;
  name: string;
  albumName: string;
  durationMs: number;
  imageUrl: string;
  url: string;
  likes: number;
  addedAt: Date;
}

export function QueueSoptifyTable() {
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<Track[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [tracks, setTracks] = useState<MusicInQueue[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async (query: string) => {
    if (query.length < 3) {
      setFilteredData([]);
      setIsDropdownVisible(false);
      return;
    }

    try {
      const response = await api.get(`/spotify/search/${query}`);
      setFilteredData(response.data || []);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setIsDropdownVisible(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    fetchData(event.target.value);
  };

  const handleGetQueue = async () => {
    setTracks([]);
    const response = await api.get('/spotify/queue');
    setTracks(response.data);
  };

  const handleSelectTrack = async (track: Track) => {
    setSearchValue('');
    setIsDropdownVisible(false);

    // Verifica se a música já está na fila
    if (tracks.some((t) => t.id === track.id)) {
      toast({
        variant: 'destructive',
        title: 'A música selecionada já se encontra na fila!'
      });
      console;
      return;
    }

    try {
      const response = await api.post('/spotify/queue', track);
      handleGetQueue();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar música à fila'
      });
      console.error('Erro ao adicionar música à fila:', error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await api.post(`/spotify/queue/like/${id}`);
      handleGetQueue();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao dar like'
      });
      console.error('Erro ao adicionar like:', error);
    }
  };
  const handleStartSong = async () => {
    try {
      if (tracks.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Não tem músicas na fila!'
        });
      }
      api.post('/spotify/queue/start');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetQueue();
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquise sua música"
          value={searchValue}
          onChange={handleInputChange}
          className="w-full md:w-[700px]"
        />
        <Button
          className="default ml-auto flex items-center gap-2"
          onClick={handleStartSong}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 4.5v15l13.5-7.5-13.5-7.5z"
            />
          </svg>
          Iniciar Música
        </Button>
      </div>

      {isDropdownVisible && filteredData.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border bg-zinc-950"
        >
          {filteredData.map((track) => (
            <div
              key={track.id}
              className="cursor-pointer p-2 hover:bg-zinc-800"
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

      <ScrollArea className="mt-4 h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            <TableRow>
              <TableHead>Capa</TableHead>
              <TableHead>Músicas</TableHead>
              <TableHead>Álbum</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tracks.length > 0 ? (
              tracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{track.likes}</span>
                      <button
                        onClick={() => handleLike(track.id)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.998 21.235a1.2 1.2 0 01-.716-.255C7.232 17.787 4 14.717 4 10.805c0-2.64 2.1-4.805 4.665-4.805 1.303 0 2.49.677 3.333 1.823a5.32 5.32 0 013.332-1.823c2.566 0 4.666 2.165 4.666 4.805 0 3.912-3.232 6.982-7.283 10.175a1.2 1.2 0 01-.717.255z"
                          />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma música na fila
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
