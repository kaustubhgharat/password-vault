"use client";

import { useState, useCallback } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const NUMBERS = '0123456789';
const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const LOOKALIKES = 'Il1O0';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookalikes, setExcludeLookalikes] = useState(true);

  const generatePassword = useCallback(() => {
    let charset = LETTERS;
    if (includeNumbers) charset += NUMBERS;
    if (includeSymbols) charset += SYMBOLS;

    if (excludeLookalikes) {
      charset = charset.split('').filter(char => !LOOKALIKES.includes(char)).join('');
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  }, [length, includeNumbers, includeSymbols, excludeLookalikes]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard!');
    setTimeout(() => {
        console.log("Clipboard auto-clear simulation.");
    }, 15000);
  };
  
  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="mb-4 text-lg font-semibold">Password Generator</h3>
      
      <div className="relative flex items-center mb-4">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="Click generate..."
          className="w-full p-2 pr-20 font-mono bg-gray-100 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
            <button onClick={generatePassword} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500">
                <RefreshCw size={20} />
            </button>
            <button onClick={copyToClipboard} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500">
                <Copy size={20} />
            </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm">Length: {length}</label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="numbers" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="numbers" className="ml-2">Include Numbers</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="symbols" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="symbols" className="ml-2">Include Symbols</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="lookalikes" checked={excludeLookalikes} onChange={(e) => setExcludeLookalikes(e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="lookalikes" className="ml-2">Exclude Look-alikes (I, l, 1, O, 0)</label>
        </div>
      </div>
    </div>
  );
}
