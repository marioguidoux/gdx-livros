"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectOption } from '@/components/ui/select';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import InfiniteScroll from 'react-infinite-scroll-component';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const FILTERS_URL = 'https://script.google.com/macros/s/AKfycbxHHZI1KQeoh1Im-s71F6QBIkYRudKPYq14qJ2lD2xtAoTNBC5MUkPK2VO-b2iPry4w/exec';

type Book = {
  id: string;
  imagem: string;
  titulo: string;
  autor: string;
  ano: string;
  editora: string;
  cidade: string;
  idioma: string;
  manuscritos: string;
  categoria: string;
  comentario: string;
  link1: string;
  link2: string;
  link3: string;
};

export default function BooksGallery() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCentury, setFilterCentury] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const pageSize = 20;

  // Load filters
  useEffect(() => {
    fetch(FILTERS_URL)
      .then(res => res.json())
      .then(data => {
        setCities(data.cities || []);
        setCategories(data.categories || []);
      })
      .catch(err => console.error('Erro ao carregar filtros:', err));
  }, []);

  // Load books on filter change
  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
    if (searchTerm) {
      fetchSearchResults();
    } else {
      loadBooks(1);
    }
  }, [searchTerm, filterCategory, filterCity, filterCentury]);

  const fetchSearchResults = async () => {
    let query = supabase
      .from('livros')
      .select('*')
      .order('titulo', { ascending: true })
      .range(0, 9999)
      .or(`titulo.ilike.%${searchTerm}%,autor.ilike.%${searchTerm}%,editora.ilike.%${searchTerm}%`);
    if (filterCategory) query = query.eq('categoria', filterCategory);
    if (filterCity) query = query.eq('cidade', filterCity);
    if (filterCentury) {
      const c = parseInt(filterCentury, 10);
      query = query.gte('ano', `${(c - 1) * 100 + 1}`).lte('ano', `${c * 100}`);
    }
    const { data, error } = await query;
    if (error) console.error('Erro na busca:', error.message);
    setBooks(data || []);
    setHasMore(false);
  };

  const loadBooks = async (pageNumber: number) => {
    let query = supabase
      .from('livros')
      .select('*')
      .order('titulo', { ascending: true })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);
    if (filterCategory) query = query.eq('categoria', filterCategory);
    if (filterCity) query = query.eq('cidade', filterCity);
    if (filterCentury) {
      const c = parseInt(filterCentury, 10);
      query = query.gte('ano', `${(c - 1) * 100 + 1}`).lte('ano', `${c * 100}`);
    }
    const { data, error } = await query;
    if (error) console.error('Erro loading books:', error.message);
    if (data) {
      setBooks(prev => [...prev, ...data]);
      if (data.length < pageSize) setHasMore(false);
      setPage(prev => prev + 1);
    }
  };

  const centuries: SelectOption[] = [
    { value: '', label: 'Século' },
    { value: '15', label: 'Século XV' },
    { value: '16', label: 'Século XVI' },
    { value: '17', label: 'Século XVII' },
    { value: '18', label: 'Século XVIII' },
    { value: '19', label: 'Século XIX' },
    { value: '20', label: 'Século XX' },
    { value: '21', label: 'Século XXI' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearchSubmit} className="sticky top-0 bg-white z-10 p-4 flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar por título, autor ou editora"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="min-w-[280px]"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
          Buscar
        </button>
        <Select options={categories} value={filterCategory} onChange={e => setFilterCategory(e.target.value)} />
        <Select options={cities}     value={filterCity}     onChange={e => setFilterCity(e.target.value)}     />
        <Select options={centuries}  value={filterCentury} onChange={e => setFilterCentury(e.target.value)}  />
      </form>

      <InfiniteScroll dataLength={books.length} next={() => loadBooks(page)} hasMore={hasMore} loader={<p>Carregando...</p>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, idx) => (
            <Card key={`${book.id}-${idx}`} className="cursor-pointer" onClick={() => setSelectedBook(book)}>
              <CardHeader>
                {book.imagem ? (
                  <img
                    src={book.imagem}
                    alt={book.titulo}
                    className="w-full h-48 object-contain"
                    loading="lazy"
                    onError={e => {
                      const img = e.currentTarget as HTMLImageElement;
                      setTimeout(() => { img.src = book.imagem; }, 1000);
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    Sem imagem
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold">{book.titulo}</h3>
                <p>{book.autor} — {book.ano}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </InfiniteScroll>

      <Modal isOpen={!!selectedBook} onClose={() => setSelectedBook(null)}>
        <ModalHeader>{selectedBook?.titulo}</ModalHeader>
        <ModalBody>
          <div className="w-full max-h-[60vh] overflow-auto mb-4">
            {selectedBook?.imagem && (
              <img
                src={selectedBook.imagem}
                alt={selectedBook.titulo}
                className="w-full h-auto object-contain"
                loading="lazy"
                onError={e => {
                  const img = e.currentTarget as HTMLImageElement;
                  setTimeout(() => { img.src = selectedBook.imagem!; }, 1000);
                }}
              />
            )}
          </div>
          <p><strong>Autor:</strong> {selectedBook?.autor}</p>
          <p><strong>Ano:</strong> {selectedBook?.ano}</p>
          <p><strong>Editora:</strong> {selectedBook?.editora}</p>
          <p><strong>Cidade:</strong> {selectedBook?.cidade}</p>
          <p><strong>Idioma:</strong> {selectedBook?.idioma}</p>
          <p><strong>Manuscritos:</strong> {selectedBook?.manuscritos}</p>
          <p><strong>Categoria:</strong> {selectedBook?.categoria}</p>
          <p><strong>Localização:</strong> {selectedBook?.id}</p>
          <p className="mt-2">{selectedBook?.comentario}</p>
          <div className="mt-4 space-y-1">
            {selectedBook?.link1 && <a href={selectedBook.link1} target="_blank" rel="noopener">Link 1</a>}
            {selectedBook?.link2 && <a href={selectedBook.link2} target="_blank" rel="noopener">Link 2</a>}
            {selectedBook?.link3 && <a href={selectedBook.link3} target="_blank" rel="noopener">Link 3</a>}
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setSelectedBook(null)}>
            Fechar
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
