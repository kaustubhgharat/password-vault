// src/app/(main)/vault/page.tsx
"use client";

import PasswordGenerator from "@/components/PasswordGenerator";
import VaultList from "@/components/VaultList";

export default function VaultPage() {
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <VaultList />
            </div>
            <div className="lg:col-span-1">
                <PasswordGenerator />
            </div>
        </div>
    );
}