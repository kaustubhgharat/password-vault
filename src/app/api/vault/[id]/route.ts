// src/app/api/vault/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { VaultItem } from '@/lib/models/VaultItem';

// The second argument is now a 'context' object
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  try {
    const userId = request.headers.get('X-User-ID');
    // Get the id from context.params
    const { id } = context.params;
    const body = await request.json();

    const updatedItem = await VaultItem.findOneAndUpdate(
      { _id: id, userId },
      {
        title: body.title,
        url: body.url,
        encryptedUsername: body.encryptedUsername,
        encryptedPassword: body.encryptedPassword,
        encryptedNotes: body.encryptedNotes,
        tags: body.tags,
      },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ message: 'Item not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating vault item' }, { status: 500 });
  }
}

// Also update the DELETE function signature for consistency
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  try {
    const userId = request.headers.get('X-User-ID');
    // Get the id from context.params
    const { id } = context.params;

    const deletedItem = await VaultItem.findOneAndDelete({ _id: id, userId });

    if (!deletedItem) {
      return NextResponse.json({ message: 'Item not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting vault item' }, { status: 500 });
  }
}