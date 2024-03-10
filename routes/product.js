import express from "express";
const router = express.Router();
import { getProducts, getProductById } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

export default router;