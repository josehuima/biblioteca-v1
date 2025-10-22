import { NextResponse } from 'next/server';
import {  rentBook } from '@/db/crud/books.crud';
import { auth } from '@clerk/nextjs/server'




export async function POST(
    
    request: Request,
    {params }: { params: { id: string } }
) {
    const { userId } = await auth()
    try {
        const {id} = await Promise.resolve(params);
        const bookId = parseInt(id);
    
        if (isNaN(bookId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
      }

    
        

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const result = await rentBook(bookId, userId);
        if (result) {
            return NextResponse.json({ message: "Book rented successfully" }, { status: 200 });
        }
        return NextResponse.json({ error: "Failed to rent book" }, { status: 500 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}