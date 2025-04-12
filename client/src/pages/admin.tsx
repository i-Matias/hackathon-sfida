import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useTranslation } from "../hooks/useTranslation";
import { Product, User } from "../types";

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

const mockUsers: User[] = [
  { id: 1, username: "farmer1", email: "farmer@example.com", role: "farmer" },
  {
    id: 2,
    username: "consumer1",
    email: "consumer@example.com",
    role: "consumer",
  },
  { id: 3, username: "farmer2", email: "farmer2@example.com", role: "farmer" },
  {
    id: 4,
    username: "consumer2",
    email: "consumer2@example.com",
    role: "consumer",
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

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            {t("adminDashboard")}
          </Typography>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="dashboard tabs"
              >
                <Tab label={t("users")} />
                <Tab label={t("allProducts")} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>{t("username")}</TableCell>
                      <TableCell>{t("email")}</TableCell>
                      <TableCell>{t("role")}</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{t(user.role)}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            {t("delete")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
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
                        <Typography variant="body2" color="text.secondary">
                          Farmer ID: {product.userId}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          {t("delete")}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
