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
  InputAdornment,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import Navbar from "../components/Navbar";
import { useTranslation } from "../hooks/useTranslation";
import { Product, ProductRequest, Message } from "../types";
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
  {
    id: 4,
    name: "Organic Carrots",
    description: "Freshly harvested carrots",
    price: 1.5,
    quantity: 75,
    userId: 3,
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
];

const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 2,
    senderName: "consumer1",
    receiverId: 1,
    receiverName: "farmer1",
    content: "Hello, I'm interested in your organic apples.",
    timestamp: "2023-05-14T10:30:00",
  },
  {
    id: 2,
    senderId: 1,
    senderName: "farmer1",
    receiverId: 2,
    receiverName: "consumer1",
    content: "Hi! They are freshly picked and available for delivery.",
    timestamp: "2023-05-14T10:35:00",
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

const ConsumerProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [buyQuantity, setBuyQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [myRequests, setMyRequests] = useState<ProductRequest[]>(mockRequests);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleBuyOpen = (product: Product) => {
    setSelectedProduct(product);
    setBuyDialogOpen(true);
    setBuyQuantity("1");
  };

  const handleMessageOpen = (product: Product) => {
    setSelectedProduct(product);
    setMessageDialogOpen(true);
    setMessage("");
  };

  const handleBuyClose = () => {
    setBuyDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleMessageClose = () => {
    setMessageDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleBuyRequest = () => {
    if (!selectedProduct || !user) return;

    const quantityNum = parseInt(buyQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (quantityNum > selectedProduct.quantity) {
      alert("Requested quantity exceeds available stock");
      return;
    }

    // Create new request
    const newRequest: ProductRequest = {
      id: Math.max(0, ...myRequests.map((r) => r.id)) + 1,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      customerId: user.id,
      customerName: user.username,
      quantity: quantityNum,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    setMyRequests([...myRequests, newRequest]);
    setBuyDialogOpen(false);
    alert("Purchase request sent successfully!");
  };

  const handleSendMessage = () => {
    if (!selectedProduct || !message || !user) return;

    // Create new message
    const newMessage: Message = {
      id: Math.max(0, ...messages.map((m) => m.id)) + 1,
      senderId: user.id,
      senderName: user.username,
      receiverId: selectedProduct.userId,
      receiverName: "Farmer", // In a real app, you'd get the actual farmer name
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessageDialogOpen(false);
    alert("Message sent successfully!");
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t("consumerDashboard")}
          </Typography>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="dashboard tabs"
              >
                <Tab label={t("products")} />
                <Tab label={t("buyRequests")} />
                <Tab label={t("messages")} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box mb={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder={t("search")}
                  value={search}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
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
                          color="primary"
                          onClick={() => handleBuyOpen(product)}
                        >
                          {t("requestToBuy")}
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleMessageOpen(product)}
                        >
                          {t("sendMessage")}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}

                {filteredProducts.length === 0 && (
                  <Box width="100%" textAlign="center" mt={3}>
                    <Typography variant="body1">No products found.</Typography>
                  </Box>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                {myRequests.map((request) => (
                  <Grid item xs={12} sm={6} md={4} key={request.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {request.productName}
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
                    </Card>
                  </Grid>
                ))}

                {myRequests.length === 0 && (
                  <Box width="100%" textAlign="center" mt={3}>
                    <Typography variant="body1">
                      No purchase requests yet.
                    </Typography>
                  </Box>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <List>
                  {messages.map((msg) => (
                    <ListItem key={msg.id} alignItems="flex-start">
                      <ListItemText
                        primary={`${
                          msg.senderName === user?.username
                            ? "You"
                            : msg.senderName
                        }`}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {msg.content}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(msg.timestamp).toLocaleString()}
                            </Typography>
                          </>
                        }
                        sx={{
                          bgcolor:
                            msg.senderName === user?.username
                              ? "#e3f2fd"
                              : "#f5f5f5",
                          p: 1,
                          borderRadius: 2,
                        }}
                      />
                    </ListItem>
                  ))}

                  {messages.length === 0 && (
                    <Box width="100%" textAlign="center" mt={3}>
                      <Typography variant="body1">{t("noMessages")}</Typography>
                    </Box>
                  )}
                </List>
              </Paper>
            </TabPanel>
          </Box>

          {/* Buy Request Dialog */}
          <Dialog open={buyDialogOpen} onClose={handleBuyClose}>
            <DialogTitle>{t("requestToBuy")}</DialogTitle>
            <DialogContent>
              {selectedProduct && (
                <>
                  <Typography variant="h6">{selectedProduct.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    ${selectedProduct.price.toFixed(2)} each
                  </Typography>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="quantity"
                    label={t("productQuantity")}
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={buyQuantity}
                    onChange={(e) => setBuyQuantity(e.target.value)}
                    inputProps={{ min: 1, max: selectedProduct.quantity }}
                  />
                  <Typography variant="body2" mt={1}>
                    Total: $
                    {(parseInt(buyQuantity) * selectedProduct.price).toFixed(2)}
                  </Typography>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBuyClose}>{t("cancel")}</Button>
              <Button onClick={handleBuyRequest} color="primary">
                {t("requestToBuy")}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Message Dialog */}
          <Dialog
            open={messageDialogOpen}
            onClose={handleMessageClose}
            fullWidth
          >
            <DialogTitle>{t("sendMessage")}</DialogTitle>
            <DialogContent>
              {selectedProduct && (
                <>
                  <Typography variant="h6" mb={2}>
                    {t("sendMessage")} {t("to")} {selectedProduct.name}{" "}
                    {t("farmer")}
                  </Typography>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="message"
                    label={t("message")}
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleMessageClose}>{t("cancel")}</Button>
              <Button
                onClick={handleSendMessage}
                color="primary"
                endIcon={<SendIcon />}
              >
                {t("send")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </>
  );
};

export default ConsumerProducts;
