"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import ThemeToggle from "@/components/ThemeToggle";
import { useFavorites } from "@/hooks/useFavorites";
import { useThemeMode } from "@/app/ThemeRegistry";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Stack,
  Pagination,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Rating,
  ListItemButton,
} from "@mui/material";
import {
  ShoppingBag as ShoppingBagIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as VisibilityIcon,
  Menu as MenuIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";

const ITEMS_PER_PAGE = 10;

type SortOption = "price-asc" | "price-desc" | "rating" | "name";
type ViewMode = "grid" | "list";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const {
    favorites,
    toggleFavorite,
    isFavorite,
    showFavoritesOnly,
    toggleShowFavorites,
    filterFavorites,
  } = useFavorites();

  const { mode } = useThemeMode();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please check your connection.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Apply favorites filter
    if (showFavoritesOnly) {
      result = result.filter((product) => favorites.includes(product.id));
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    showFavoritesOnly,
    favorites,
    sortBy,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortBy(event.target.value as SortOption);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Filters
      </Typography>
      <List>
        <ListItem>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={handleSortChange}>
              <MenuItem value="rating">Highest Rating</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name">Name A-Z</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        <ListItem>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => newView && setViewMode(newView)}
            size="small"
            fullWidth
          >
            <ToggleButton value="grid" aria-label="grid view">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </ListItem>

        <ListItemButton onClick={toggleShowFavorites}>
          <ListItemIcon>
            <Badge badgeContent={favorites.length} color="error">
              {showFavoritesOnly ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary="Show Favorites Only"
            secondary={showFavoritesOnly ? `${favorites.length} items` : ""}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            Loading products...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography variant="h5" color="error" align="center">
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            startIcon={<ShoppingBagIcon />}
          >
            Try Again
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawer}
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <AppBar position="sticky" color="default" elevation={1}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              Product Explorer
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Tooltip title="Sort products">
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    displayEmpty
                    inputProps={{ "aria-label": "sort products" }}
                  >
                    <MenuItem value="rating">Highest Rating</MenuItem>
                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>

              <Tooltip title="View mode">
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newView) => newView && setViewMode(newView)}
                  size="small"
                >
                  <ToggleButton value="grid" aria-label="grid view">
                    <ViewModuleIcon />
                  </ToggleButton>
                  <ToggleButton value="list" aria-label="list view">
                    <ViewListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Tooltip>

              <Tooltip
                title={`${
                  showFavoritesOnly ? "Show all" : "Show favorites only"
                }`}
              >
                <IconButton
                  onClick={toggleShowFavorites}
                  color={showFavoritesOnly ? "error" : "default"}
                  aria-label="favorites filter"
                >
                  <Badge badgeContent={favorites.length} color="error">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Stack>

            <ThemeToggle />
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
          {/* Search and Filters Section */}
          <Card elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />

                <FilterDropdown
                  categories={categories}
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                  label="Category"
                  fullWidth
                />
              </Grid>

              {/* Stats and Active Filters */}
              {(searchQuery || selectedCategory || showFavoritesOnly) && (
                <Box
                  sx={{ mt: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Showing{" "}
                      <strong>{filteredAndSortedProducts.length}</strong> of{" "}
                      <strong>{products.length}</strong> products
                    </Typography>

                    {searchQuery && (
                      <Chip
                        label={`Search: "${searchQuery}"`}
                        onDelete={() => setSearchQuery("")}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}

                    {selectedCategory && (
                      <Chip
                        label={`Category: ${selectedCategory}`}
                        onDelete={() => setSelectedCategory("")}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}

                    {showFavoritesOnly && (
                      <Chip
                        label="Favorites Only"
                        onDelete={toggleShowFavorites}
                        size="small"
                        color="error"
                        variant="outlined"
                        icon={<FavoriteIcon />}
                      />
                    )}
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>

          {currentProducts.length === 0 ? (
            <Card sx={{ p: 8, textAlign: "center" }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {showFavoritesOnly && favorites.length === 0
                  ? "You haven't added any products to favorites yet."
                  : "Try adjusting your search or filter criteria"}
              </Typography>
              {showFavoritesOnly && (
                <Button
                  variant="outlined"
                  onClick={toggleShowFavorites}
                  startIcon={<FavoriteIcon />}
                >
                  Show All Products
                </Button>
              )}
            </Card>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" ? (
                <Grid container spacing={3}>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={isFavorite(product.id)}
                      onToggleFavorite={toggleFavorite}
                      onViewDetails={() =>
                        router.push(`/products/${product.id}`)
                      }
                    />
                  ))}
                </Grid>
              ) : (
                /* List View */
                <Stack spacing={2}>
                  {currentProducts.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      isFavorite={isFavorite(product.id)}
                      onToggleFavorite={toggleFavorite}
                      onViewDetails={() =>
                        router.push(`/products/${product.id}`)
                      }
                    />
                  ))}
                </Stack>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Card elevation={2} sx={{ mt: 4, borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Page {currentPage} of {totalPages} •{" "}
                        <Box
                          component="span"
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          Showing {startIndex + 1}-
                          {Math.min(endIndex, filteredAndSortedProducts.length)}{" "}
                          of {filteredAndSortedProducts.length} products
                        </Box>
                      </Typography>

                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        siblingCount={1}
                        boundaryCount={1}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Footer */}
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact support@store.com • {products.length} products
              • {favorites.length} favorites
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        <Card
          elevation={2}
          sx={{
            height: "100%",
            borderRadius: 0,
            borderLeft: 1,
            borderColor: "divider",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="bold">
                Quick Filters
              </Typography>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Sort By
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={sortBy} onChange={handleSortChange}>
                    <MenuItem value="rating">Highest Rating</MenuItem>
                    <MenuItem value="price-asc">Price: Low to High</MenuItem>
                    <MenuItem value="price-desc">Price: High to Low</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  View Mode
                </Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newView) => newView && setViewMode(newView)}
                  fullWidth
                  size="small"
                >
                  <ToggleButton value="grid">
                    <ViewModuleIcon sx={{ mr: 1 }} />
                    Grid
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ViewListIcon sx={{ mr: 1 }} />
                    List
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Favorites
                </Typography>
                <Button
                  fullWidth
                  variant={showFavoritesOnly ? "contained" : "outlined"}
                  color={showFavoritesOnly ? "error" : "inherit"}
                  onClick={toggleShowFavorites}
                  startIcon={
                    <Badge badgeContent={favorites.length} color="error">
                      <FavoriteIcon />
                    </Badge>
                  }
                >
                  {showFavoritesOnly ? "Hide Favorites" : "Show Favorites"}
                </Button>
              </Box>

              {/* Theme Info */}
              <Box
                sx={{
                  mt: "auto",
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">
                    {mode === "dark" ? "🌙 Dark" : "☀️ Light"} Mode
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

// Product Card Component
function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onViewDetails: () => void;
}) {
  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
          "& .product-image": {
            transform: "scale(1.05)",
          },
        },
        cursor: "pointer",
      }}
      onClick={onViewDetails}
    >
      {/* Product Image */}
      <Box
        sx={{
          position: "relative",
          height: 200,
          overflow: "hidden",
          bgcolor: "grey.50",
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.title}
          className="product-image"
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
            p: 2,
            transition: "transform 0.3s ease",
          }}
        />

        {/* Category Chip */}
        <Chip
          label={product.category}
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
          }}
        />

        {/* Favorite Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "background.paper",
            "&:hover": { bgcolor: "background.paper" },
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            height: 48,
          }}
        >
          {product.title}
        </Typography>

        {/* Rating */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Rating
            value={product.rating.rate}
            precision={0.1}
            readOnly
            size="small"
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
          />
          <Typography variant="caption" color="text.secondary">
            ({product.rating.count})
          </Typography>
        </Stack>

        {/* Price */}
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary.main"
          sx={{ mb: 2 }}
        >
          ${product.price.toFixed(2)}
        </Typography>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<ShoppingBagIcon />}
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic
            }}
            size="small"
          >
            Add to Cart
          </Button>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            size="small"
            aria-label="view details"
          >
            <VisibilityIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Product List Item Component
function ProductListItem({
  product,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onViewDetails: () => void;
}) {
  return (
    <Card elevation={1} sx={{ borderRadius: 2 }}>
      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        {/* Product Image */}
        <Box
          sx={{
            width: 120,
            height: 120,
            position: "relative",
            flexShrink: 0,
          }}
        >
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          />
          <IconButton
            onClick={() => onToggleFavorite(product.id)}
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              bgcolor: "background.paper",
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FavoriteIcon color="error" fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.title}
                </Typography>
                <Chip label={product.category} size="small" sx={{ mt: 0.5 }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ${product.price.toFixed(2)}
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {product.description}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Rating
                value={product.rating.rate}
                precision={0.1}
                readOnly
                size="small"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
              <Typography variant="caption" color="text.secondary">
                {product.rating.rate} ({product.rating.count} reviews)
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<ShoppingBagIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart logic
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={onViewDetails}
                >
                  Details
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
