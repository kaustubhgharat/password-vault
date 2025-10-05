// src/app/api/vault/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { VaultItem } from '@/lib/models/VaultItem';

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const userId = request.headers.get('X-User-ID');
    const items = await VaultItem.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error fetching vault items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const userId = request.headers.get('X-User-ID');
    const body = await request.json();
    const newItem = await VaultItem.create({ ...body, userId });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
     console.log(error);
    return NextResponse.json({ message: 'Error creating vault item' }, { status: 500 });
  }
}