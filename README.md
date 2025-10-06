# Secure Vault - A Client-Side Encrypted Password Manager

[🌐 Live Demo](https://password-vault-azure.vercel.app/vault)

Secure Vault is a simple, fast, and privacy-first password manager built with **Next.js**, **MongoDB**, and **TypeScript**. It features **client-side encryption**, ensuring that your sensitive data is never stored in plaintext on the server.

---

## Features

- **Secure Authentication:** User registration and login system powered by `next-auth`.
- **Password Generator:** Create strong, customizable passwords.
- **Secure Vault:** Save, view, edit, and delete your login credentials.
- **Client-Side Encryption:** Your data is encrypted in your browser using your master password before it's sent to the server. The server only stores encrypted blobs.
- **Search:** Quickly find any item by searching its title, URL.
- **Encrypted Backup & Restore:** Securely export and import your entire vault.
- **Dark Mode:** A sleek dark theme for comfortable viewing in low-light environments.

---

## Note on Cryptography

For client-side encryption, this project uses **CryptoJS** with the **AES-256** standard.  
The encryption key is derived from the user's master password and a unique salt using **PBKDF2 with 100,000 iterations**, providing strong resistance against brute-force attacks.

---

## 🖼️ Screenshots

Example:

![Example1](/public/homepage.png)


## Tech Stack

- **Framework:** Next.js (App Router)  
- **Language:** TypeScript  
- **Database:** MongoDB with Mongoose  
- **Authentication:** next-auth  
- **Client-Side Encryption:** CryptoJS 
- **Styling:** Tailwind CSS  
- **Theming:** next-themes  
- **UI Components:** React Hot Toast & Lucide React  

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)  
- MongoDB instance (e.g., a free cluster from MongoDB Atlas)  

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-link>
    cd password-vault
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables. Create a `.env` file in the root directory and add your configuration:
    ```env
    MONGODB_URI="mongodb+srv://gharatkaustubh36_db_user:EHMAdnti9Tgj8Enh@password-vault.ujcaopn.mongodb.net/"
    JWT_SECRET="Password_Generator_Secure_Vault_Project"
    NEXTAUTH_SECRET="abcdefghijk"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Live Demo

Check out the live version of Secure Vault here:  
[https://password-vault-azure.vercel.app/vault](https://password-vault-azure.vercel.app/vault)

