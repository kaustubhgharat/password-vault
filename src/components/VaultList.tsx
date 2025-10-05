"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { decryptData, encryptData } from '@/utils/crypto';
import AddEditVaultItemModal from './AddEditVaultItemModal';
import toast from 'react-hot-toast';
import { Plus, Copy, Trash2, Edit, Eye, EyeOff, Upload, Download } from 'lucide-react';

interface VaultItem {
  _id: string;
  title: string;
  url: string;
  encryptedUsername: string;
  encryptedPassword: string;
  encryptedNotes: string;
  tags: string[];
}

type RawVaultItem = {
  title: string;
  url: string;
  username: string;
  password: string;
  notes: string;
  tags: string[];
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vault');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setItems(data);
    } catch (error) {
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
             item.url.toLowerCase().includes(lowercasedFilter) ||
             (item.tags || []).some(tag => tag.toLowerCase().includes(lowercasedFilter)); // The fix is here
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

  const handleExport = () => {
    if (!decryptionKey || items.length === 0) {
      toast.error("No items to export or vault is locked.");
      return;
    }
    if (!window.confirm("This will export all your vault items to an encrypted text file. Continue?")) return;

    const decryptedForExport: RawVaultItem[] = items.map(item => ({
      title: item.title,
      url: item.url,
      username: decryptData(item.encryptedUsername, decryptionKey),
      password: decryptData(item.encryptedPassword, decryptionKey),
      notes: decryptData(item.encryptedNotes, decryptionKey),
      tags: item.tags || [], // Use fallback for old items without tags
    }));

    const jsonString = JSON.stringify(decryptedForExport, null, 2);
    const encryptedData = encryptData(jsonString, decryptionKey);

    const blob = new Blob([encryptedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secure-vault-backup-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Vault exported successfully!");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !decryptionKey) {
      toast.error("No file selected or vault is locked.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const encryptedContent = e.target?.result as string;
        try {
            const decryptedJson = decryptData(encryptedContent, decryptionKey);
            const importedItems: RawVaultItem[] = JSON.parse(decryptedJson);

            if (!Array.isArray(importedItems)) throw new Error("Invalid file format.");
            
            toast.loading(`Importing ${importedItems.length} items...`, { id: 'import-toast' });

            for (const item of importedItems) {
                const encryptedPayload = {
                    title: item.title,
                    url: item.url,
                    encryptedUsername: encryptData(item.username, decryptionKey),
                    encryptedPassword: encryptData(item.password, decryptionKey),
                    encryptedNotes: encryptData(item.notes, decryptionKey),
                    tags: item.tags || [],
                };
                await fetch('/api/vault', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(encryptedPayload),
                });
            }

            toast.success(`Successfully imported ${importedItems.length} items!`, { id: 'import-toast' });
            fetchItems();
        } catch (error) {
            toast.error("Import failed. The file may be corrupt or the decryption key is incorrect.");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (isLoading) return <div>Loading vault...</div>;

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Vault Items</h3>
        <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".txt, .json" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                <Upload size={16} /> Import
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                <Download size={16} /> Export
            </button>
            <button onClick={openAddModal} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <Plus size={16} /> Add Item
            </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by title, URL, or tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-50 border rounded-md"
      />

      <div className="space-y-3">
        {decryptedItems.length > 0 ? decryptedItems.map((item) => (
          <div key={item._id} className="p-4 border rounded-md">
            <div className="flex items-start justify-between">
                <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.username}</p>
                    <p className="text-sm text-gray-500 break-all">{item.url}</p>
                    {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {item.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
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