import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
} 