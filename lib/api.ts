const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com';

const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production';

export async function fetchProducts() {
  try {
    const fetchOptions: RequestInit = isBuildTime
      ? {
          cache: 'no-store', 
          headers: {
            'User-Agent': 'Next.js Static Generation',
          },
        }
      : {
          next: { revalidate: 3600 },
        };

    const res = await fetch(`${API_URL}/products`, fetchOptions);
    
    if (!res.ok) {
      // Provide more detailed error message
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('API Error in fetchProducts:', error);
    
    if (isBuildTime) {
      console.log('Build-time fetch failed, returning fallback data');
      return getFallbackProducts();
    }
    
    throw new Error('Failed to fetch products');
  }
}

export async function fetchProductById(id: number) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch product ${id}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`API Error in fetchProductById(${id}):`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
}

function getFallbackProducts() {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: (i + 1) * 10,
    category: 'general',
    image: `https://fakestoreapi.com/img/81fPKd-2AYL.jpg`,
    rating: {
      rate: 4.5,
      count: 120,
    },
    description: 'A premium quality product with excellent features.',
  }));
}