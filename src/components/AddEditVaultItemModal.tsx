"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { encryptData, decryptData } from "@/utils/crypto";
import toast from "react-hot-toast";

export interface VaultItemForm {
  title: string;
  url: string;
  username: string;
  password: string;
  notes: string;
  tags: string;
}

interface VaultItemData {
  _id: string;
  title: string;
  url: string;
  encryptedUsername: string;
  encryptedPassword: string;
  encryptedNotes: string;
  tags: string[];
}

interface ModalProps {
  item: VaultItemData | null;
  onClose: () => void;
  onSave: () => void;
}

export default function AddEditVaultItemModal({
  item,
  onClose,
  onSave,
}: ModalProps) {
  const [formData, setFormData] = useState<VaultItemForm>({
    title: "",
    url: "",
    username: "",
    password: "",
    notes: "",
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { decryptionKey } = useAuth();

  useEffect(() => {
    if (item && decryptionKey) {
      setFormData({
        title: item.title,
        url: item.url,
        username: decryptData(item.encryptedUsername, decryptionKey),
        password: decryptData(item.encryptedPassword, decryptionKey),
        notes: decryptData(item.encryptedNotes, decryptionKey),
        tags: (item.tags || []).join(", "),
      });
    }
  }, [item, decryptionKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decryptionKey) {
      toast.error("Security key not found. Please log in again.");
      return;
    }
    setIsLoading(true);
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const encryptedPayload = {
      title: formData.title,
      url: formData.url,
      encryptedUsername: encryptData(formData.username, decryptionKey),
      encryptedPassword: encryptData(formData.password, decryptionKey),
      encryptedNotes: encryptData(formData.notes, decryptionKey),
      tags: tagsArray,
    };

    try {
      const url = item ? `/api/vault/${item._id}` : "/api/vault";
      const method = item ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encryptedPayload),
      });

      if (!res.ok) throw new Error("Failed to save item.");

      toast.success(`Item ${item ? "updated" : "saved"} successfully!`);
      onSave();
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold">
          {item ? "Edit Item" : "Add New Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <input
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="URL"
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            rows={3}
          ></textarea>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md disabled:bg-blue-300 hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
