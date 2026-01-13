// import { Product } from '@/types';

// const API_BASE_URL = 'https://fakestoreapi.com';

// export async function fetchProducts(): Promise<Product[]> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/products`, {
//       next: { revalidate: 3600 } // Cache for 1 hour
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch products');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     throw error;
//   }
// }

// export async function fetchProductById(id: number): Promise<Product> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch product');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error(`Error fetching product ${id}:`, error);
//     throw error;
//   }
// }


// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com';

export async function fetchProducts() {
  try {
    // Add timeout for build process
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch(`${API_URL}/products`, {
      signal: controller.signal,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('API Error in fetchProducts:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function fetchProductById(id: number) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch product ${id}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`API Error in fetchProductById(${id}):`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
}