"use client";

import { fetchProductById } from "@/lib/api";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Rating,
  Breadcrumbs,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocalShipping as ShippingIcon,
  AssignmentReturn as ReturnIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { use } from "react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(parseInt(id));

        if (!data) {
          notFound();
          return;
        }

        setProduct(data);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading product...</Typography>
      </Box>
    );
  }

  if (error || !product) {
    notFound();
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Paper
        elevation={0}
        square
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Home
              </Box>
            </Link>
            <Link href="/products" style={{ textDecoration: "none" }}>
              <Box
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                Products
              </Box>
            </Link>
            <Typography color="text.primary" fontWeight="medium">
              {product.title}
            </Typography>
          </Breadcrumbs>

          <Link href="/products" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                "&:hover": { color: "primary.dark" },
              }}
            >
              <ArrowBackIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography>Back to Products</Typography>
            </Box>
          </Link>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 6,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <Box
                sx={{
                  position: "relative",
                  height: { xs: 400, lg: 600 },
                  bgcolor: "grey.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  style={{
                    objectFit: "contain",
                    padding: "2rem",
                  }}
                  sizes="(max-width: 1200px) 100vw, 50vw"
                  priority
                />

                {/* Category Badge */}
                <Chip
                  label={product.category}
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    textTransform: "capitalize",
                  }}
                />
              </Box>
            </div>

            {/* Product Details */}
            <div className="lg:col-span-1">
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Stack spacing={3}>
                  {/* Product Title */}
                  <Box>
                    <Typography
                      variant="h4"
                      component="h1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      sx={{ fontSize: { xs: "1.75rem", md: "2.125rem" } }}
                    >
                      {product.title}
                    </Typography>

                    {/* Price and Rating */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={3}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      sx={{ mb: 2 }}
                    >
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="primary.main"
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Rating
                          value={product.rating?.rate || 4.5}
                          precision={0.1}
                          readOnly
                          size="medium"
                          icon={<StarIcon fontSize="inherit" />}
                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {product.rating?.rate || 4.5} (
                          {product.rating?.count || 120} reviews)
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider />

                  {/* Description */}
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      color="text.primary"
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {product.description}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Add to Cart Button */}
                  <Box>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: "bold",
                        borderRadius: 2,
                      }}
                      onClick={() => {
                        console.log("Added to cart:", product);
                        // Add your cart logic here
                      }}
                    >
                      Add to Cart - ${product.price.toFixed(2)}
                    </Button>
                  </Box>

                  {/* Key Features */}
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      color="text.primary"
                    >
                      Key Features
                    </Typography>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          • Premium Quality Materials
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Durable Construction
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Comfortable Design
                        </Typography>
                      </Stack>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          • Easy Maintenance
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Multi-purpose Use
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • Value for Money
                        </Typography>
                      </Stack>
                    </div>
                  </Box>
                </Stack>
              </Box>
            </div>
          </div>
        </Paper>

        {/* Service Features */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Card
            elevation={2}
            sx={{ borderRadius: 2, height: "100%", bgcolor: "primary.50" }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <ShippingIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Fast Shipping
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Free shipping on orders over $50. Delivery within 2-3 business
                days.
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={2}
            sx={{ borderRadius: 2, height: "100%", bgcolor: "success.50" }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <ReturnIcon color="success" />
                <Typography variant="h6" fontWeight="bold">
                  Easy Returns
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                30-day return policy. Full refund or exchange available.
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={2}
            sx={{ borderRadius: 2, height: "100%", bgcolor: "warning.50" }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <SecurityIcon color="warning" />
                <Typography variant="h6" fontWeight="bold">
                  Secure Payment
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                100% secure payments. All major credit cards accepted.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews Preview */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Customer Reviews
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating value={5} readOnly size="small" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      5.0 - Excellent!
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    "Absolutely love this product! Quality is amazing and it
                    exceeded my expectations."
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    - Sarah Johnson
                  </Typography>
                </Stack>
              </Box>
            </div>
            <div className="md:col-span-1">
              <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating value={4} readOnly size="small" />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      4.0 - Great Value
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    "Good quality for the price. Would definitely recommend to
                    others."
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    - Michael Chen
                  </Typography>
                </Stack>
              </Box>
            </div>
          </div>
        </Paper>

        <Box sx={{ mt: 8, textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Need help with your purchase? Contact our customer support at
            support@store.com or call (800) 123-4567
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Monday to Friday, 9 AM - 6 PM EST
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
