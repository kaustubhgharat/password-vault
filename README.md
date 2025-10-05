# Secure Vault - A Client-Side Encrypted Password Manager

This is a simple, fast, and privacy-first password manager built with the Next.js, MongoDB, and TypeScript. It features client-side encryption, ensuring that your sensitive data is never stored in plaintext on the server.

## Features

- **Password Generator**: Create strong, customizable passwords.
- **Secure Vault**: Save, view, edit, and delete your login credentials.
- **Client-Side Encryption**: Your data is encrypted in your browser using your master password before it's sent to the server. The server only ever stores encrypted blobs.
- **Search**: Quickly find the credentials you need.
- **Copy to Clipboard**: With a 15-second auto-clear simulation.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) stored in httpOnly cookies
- **Client-Side Encryption**: CryptoJS (AES-256 + PBKDF2)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB instance (local or a cloud service like MongoDB Atlas)

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
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
