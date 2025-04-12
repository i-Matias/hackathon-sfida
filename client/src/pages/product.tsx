import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useTranslation } from "../hooks/useTranslation";
import { Product, ProductRequest } from "../types";
import { useAuthStore } from "../stores/useAuthStore";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Organic Apples",
    description: "Fresh organic apples from local farm",
    price: 2.5,
    quantity: 100,
    userId: 1,
  },
  {
    id: 2,
    name: "Fresh Tomatoes",
    description: "Juicy tomatoes picked yesterday",
    price: 1.8,
    quantity: 50,
    userId: 1,
  },
  {
    id: 3,
    name: "Potatoes",
    description: "Local farm potatoes",
    price: 1.2,
    quantity: 200,
    userId: 1,
  },
];

const mockRequests: ProductRequest[] = [
  {
    id: 1,
    productId: 1,
    productName: "Organic Apples",
    customerId: 2,
    customerName: "consumer1",
    quantity: 10,
    status: "pending",
    requestedAt: "2023-05-15T10:30:00",
  },
  {
    id: 2,
    productId: 2,
    productName: "Fresh Tomatoes",
    customerId: 2,
    customerName: "consumer1",
    quantity: 5,
    status: "approved",
    requestedAt: "2023-05-14T14:20:00",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const FarmerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [requests, setRequests] = useState<ProductRequest[]>(mockRequests);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCurrentProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setQuantity(product.quantity.toString());
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (!name || !description || !price || !quantity) {
      alert("Please fill in all fields");
      return;
    }

    if (editMode && currentProduct) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === currentProduct.id
          ? {
              ...p,
              name,
              description,
              price: parseFloat(price),
              quantity: parseInt(quantity),
            }
          : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(0, ...products.map((p) => p.id)) + 1,
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        userId: user?.id || 1,
      };
      setProducts([...products, newProduct]);
    }

    setOpen(false);
  };

  const handleRequestAction = (
    requestId: number,
    status: "approved" | "rejected"
  ) => {
    const updatedRequests = requests.map((req) =>
      req.id === requestId ? { ...req, status } : req
    );
    setRequests(updatedRequests);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t("farmerDashboard")}
          </Typography>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="dashboard tabs"
              >
                <Tab label={t("myProducts")} />
                <Tab label={t("buyRequests")} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                >
                  {t("addProduct")}
                </Button>
              </Box>

              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                        <Typography variant="body1" mt={1}>
                          {t("productPrice")}: ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body1">
                          {t("productQuantity")}: {product.quantity}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => handleEdit(product)}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(product.id)}
                        >
                          {t("delete")}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {requests.map((request) => (
                  <Grid item xs={12} sm={6} md={4} key={request.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {request.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t("requestToBuy")} by {request.customerName}
                        </Typography>
                        <Typography variant="body1" mt={1}>
                          {t("productQuantity")}: {request.quantity}
                        </Typography>
                        <Typography variant="body1">
                          Status: {request.status}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(request.requestedAt).toLocaleString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {request.status === "pending" && (
                          <>
                            <Button
                              size="small"
                              color="primary"
                              onClick={() =>
                                handleRequestAction(request.id, "approved")
                              }
                            >
                              {t("approve")}
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() =>
                                handleRequestAction(request.id, "rejected")
                              }
                            >
                              {t("reject")}
                            </Button>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Box>

          {/* Product Form Dialog */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editMode ? t("edit") : t("addProduct")}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={t("productName")}
                type="text"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="dense"
                id="description"
                label={t("productDescription")}
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                margin="dense"
                id="price"
                label={t("productPrice")}
                type="number"
                fullWidth
                variant="outlined"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <TextField
                margin="dense"
                id="quantity"
                label={t("productQuantity")}
                type="number"
                fullWidth
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>{t("cancel")}</Button>
              <Button onClick={handleSave}>{t("save")}</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </>
  );
};

export default FarmerDashboard;
