const express = require('express');
const { 
  removeFromCart, 
  getCart, 
  updateCartItemQuantity, 
  addToCart
} = require('../controller/cartController');
const { requireSignIn } = require('../middleWare/authMiddleWare');

const router = express.Router();

// Add to Cart
router.post("/", requireSignIn, addToCart);

// Remove from cart (by productId)
router.delete("/:productId", requireSignIn,removeFromCart);

// Update Cart Item Quantity (by productId)
router.put("/:productId", requireSignIn,updateCartItemQuantity);

// Get Cart
router.get("/", requireSignIn,getCart);

module.exports = router;
