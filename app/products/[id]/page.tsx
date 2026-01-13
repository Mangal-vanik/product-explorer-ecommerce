import { fetchProductById, fetchProducts } from "@/lib/api";
import { notFound } from "next/navigation";
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
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product: { id: { toString: () => any; }; }) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await fetchProductById(parseInt(id));

    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header with Breadcrumbs */}
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
                  }}
                >
                  <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
                  Home
                </Box>
              </Link>
              <Link href="/" style={{ textDecoration: "none" }}>
                <Typography color="text.secondary">Products</Typography>
              </Link>
              <Typography color="text.primary" fontWeight="medium">
                {product.title}
              </Typography>
            </Breadcrumbs>

            <Link href="/" style={{ textDecoration: "none" }}>
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
                      >
                        {product.title}
                      </Typography>

                      {/* Price and Rating */}
                      <Stack
                        direction="row"
                        spacing={3}
                        alignItems="center"
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
                            value={product.rating.rate}
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
                            {product.rating.rate} ({product.rating.count}{" "}
                            reviews)
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
                      <div className="grid grid-cols-2 gap-2">
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

          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Return Policy
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    • 30-day return policy
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Free returns on all orders
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Full refund or exchange
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Warranty
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    • 1-year manufacturer warranty
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • 24/7 customer support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Extended warranty available
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Reviews Preview */}
          <Paper
            elevation={2}
            sx={{
              mt: 6,
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

          {/* Footer Note */}
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact our customer support at support@store.com
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  } catch (error) {
    notFound();
  }
}
