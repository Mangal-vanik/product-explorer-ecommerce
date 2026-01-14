// lib/api.ts - COMPLETELY REWRITTEN
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fakestoreapi.com";

const isServer = typeof window === "undefined";

export async function fetchProducts() {
 const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: isServer ? "no-store" : "default",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Next.js)",
      },
    });

    if (!res.ok) {
      console.warn(`API returned ${res.status}, using mock data`);
      return getMockProducts();
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return getMockProducts();
  }
}

export async function fetchProductById(id: number) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store", // Always fresh data
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Product not found");
      }
      console.warn(`Failed to fetch product ${id}, returning mock`);
      return getMockProduct(id);
    }

    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);

    // Return mock data if API fails
    if (isServer && process.env.NODE_ENV === "production") {
      return getMockProduct(id);
    }

    throw error;
  }
}

// Mock data for build time
function getMockProducts() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: (i + 1) * 10,
    category: ["electronics", "jewelery", "men's clothing", "women's clothing"][
      i % 4
    ],
    image: `https://fakestoreapi.com/img/${(i % 10) + 1}.jpg`,
    rating: {
      rate: 4 + (i % 5) / 10,
      count: 100 + i * 10,
    },
    description: `This is a premium quality product ${
      i + 1
    } with excellent features and durability. Perfect for everyday use.`,
  }));
}

function getMockProduct(id: number) {
  return {
    id,
    title: `Product ${id}`,
    price: id * 10,
    category: ["electronics", "jewelery", "men's clothing", "women's clothing"][
      id % 4
    ],
    image: `https://fakestoreapi.com/img/${(id % 10) + 1}.jpg`,
    rating: {
      rate: 4 + (id % 5) / 10,
      count: 100 + id * 10,
    },
    description: `This is a premium quality product ${id} with excellent features and durability. Perfect for everyday use.`,
  };
}
