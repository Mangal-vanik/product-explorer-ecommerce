export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export interface FilterState {
  category: string;
  searchQuery: string;
  showFavorites: boolean;
}