import { Router } from 'express';
import productController from '../controllers/productController';

export const router = Router();

router.post('/products', productController.addProduct);           // Add product 
router.get('/products', productController.getAllProducts);       // Get all products
router.get('/products/user', productController.getUserProducts); // Get products by user
router.put('/products/:productId', productController.updateProduct); // Update product
router.delete('/products/:productId', productController.deleteProduct); // Delete product
