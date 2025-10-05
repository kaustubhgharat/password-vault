// src/app/api/vault/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { VaultItem } from '@/lib/models/VaultItem';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const userId = request.headers.get('X-User-ID');
    const { id } = params;
    const body = await request.json();

    const updatedItem = await VaultItem.findOneAndUpdate(
      { _id: id, userId },
      body,
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ message: 'Item not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json(updatedItem);
  } catch (error) {
        console.log(error);
    return NextResponse.json({ message: 'Error updating vault item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const userId = request.headers.get('X-User-ID');
    const { id } = params;

    const deletedItem = await VaultItem.findOneAndDelete({ _id: id, userId });

    if (!deletedItem) {
      return NextResponse.json({ message: 'Item not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error deleting vault item' }, { status: 500 });
  }
}