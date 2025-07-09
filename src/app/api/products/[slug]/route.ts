import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 