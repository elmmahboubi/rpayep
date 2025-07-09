import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/data';

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Failed to get product ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to retrieve product' },
      { status: 500 }
    );
  }
} 