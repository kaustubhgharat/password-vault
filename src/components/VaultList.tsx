// src/components/VaultList.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { decryptData } from '@/utils/crypto';
import AddEditVaultItemModal, { VaultItemForm } from './AddEditVaultItemModal';
import toast from 'react-hot-toast';
import { Plus, Copy, Trash2, Edit, Eye, EyeOff } from 'lucide-react';

interface VaultItem {
  _id: string;
  title: string;
  url: string;
  encryptedUsername: string;
  encryptedPassword: string;
  encryptedNotes: string;
}

export default function VaultList() {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const { decryptionKey } = useAuth();

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vault');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setItems(data);
    } catch (error) {
        console.log(error);
      toast.error('Could not fetch vault items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = items.filter(item => {
      return item.title.toLowerCase().includes(lowercasedFilter) || 
             item.url.toLowerCase().includes(lowercasedFilter);
    });
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const decryptedItems = useMemo(() => {
    if (!decryptionKey) return [];
    return filteredItems.map(item => ({
      ...item,
      username: decryptData(item.encryptedUsername, decryptionKey),
      password: decryptData(item.encryptedPassword, decryptionKey),
      notes: decryptData(item.encryptedNotes, decryptionKey),
    }));
  }, [filteredItems, decryptionKey]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };
  
  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure you want to delete this item?")) return;
    try {
        await fetch(`/api/vault/${id}`, { method: 'DELETE' });
        toast.success("Item deleted.");
        fetchItems(); 
    } catch (error) {
        console.log(error);
        toast.error("Failed to delete item.");
    }
  };

  const openEditModal = (item: VaultItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };
  
  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) return <div>Loading vault...</div>;

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Vault Items</h3>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title or URL..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />

      <div className="space-y-3">
        {decryptedItems.length > 0 ? decryptedItems.map((item) => (
          <div key={item._id} className="p-4 border rounded-md">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.username}</p>
                    <p className="text-sm text-gray-500 break-all">{item.url}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(item)} className="p-1 text-gray-500 hover:text-blue-600"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center font-mono text-sm">
                    <span className="w-40 truncate">
                        {visiblePasswords[item._id] ? item.password : '••••••••••••'}
                    </span>
                    <button onClick={() => togglePasswordVisibility(item._id)} className="p-1 text-gray-500 hover:text-gray-800">
                        {visiblePasswords[item._id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                <button onClick={() => handleCopy(item.password)} className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 rounded-md hover:bg-blue-50">
                    <Copy size={12} /> Copy Password
                </button>
            </div>
          </div>
        )) : (
            <p className="text-center text-gray-500">No items found. Add one to get started!</p>
        )}
      </div>
      
      {isModalOpen && (
        <AddEditVaultItemModal 
            item={editingItem}
            onClose={() => setIsModalOpen(false)}
            onSave={() => {
                setIsModalOpen(false);
                fetchItems();
            }}
        />
      )}
    </div>
  );
}