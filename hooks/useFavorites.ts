import { useState, useEffect, useCallback } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('product-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
      }
    }
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];
      
      localStorage.setItem('product-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const toggleShowFavorites = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  const filterFavorites = useCallback((products: any[]) => {
    if (!showFavoritesOnly) return products;
    return products.filter(product => favorites.includes(product.id));
  }, [showFavoritesOnly, favorites]);

  return { 
    favorites, 
    toggleFavorite, 
    isFavorite, 
    showFavoritesOnly,
    toggleShowFavorites,
    filterFavorites 
  };
}