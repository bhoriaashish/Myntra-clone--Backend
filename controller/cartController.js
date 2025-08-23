const Cart = require('../model/cartModel');
const Product = require('../model/productModel');

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.products.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += parseInt(quantity, 10);
      } else {
        cart.products.push({
          productId,
          quantity: parseInt(quantity, 10), //or +quantity
          price: product.price
        });
      }
    } else {
      cart = new Cart({
        userId,
        products: [{
          productId,
          quantity: parseInt(quantity, 10),
          price: product.price
        }]
      });
    }

    cart.totalAmount = cart.products.reduce((acc, item) => acc + item.quantity * item.price, 0);

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(
      item => item.productId.toString() !== productId
    );

    cart.totalAmount = cart.products.reduce((acc, item) => acc + item.quantity * item.price, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE QUANTITY
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (isNaN(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a number' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in the cart' });

    if (quantity <= 0) {
      cart.products.splice(itemIndex, 1);
    } else {
      cart.products[itemIndex].quantity = parseInt(quantity, 10);
    }

    cart.totalAmount = cart.products.reduce((acc, item) => acc + item.quantity * item.price, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET CART
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate({
      path: 'products.productId',
      select: 'name price image'
    });

    if (!cart) {
      return res.status(200).json({
        items: [],
        totalItems: 0,
        subtotal: 0
      });
    }

    let subtotal = 0;
    let totalItems = 0;

    cart.products.forEach(item => {
      subtotal += item.quantity * item.price;
      totalItems += item.quantity;
    });

    const response = {
      items: cart.products.map(item => ({
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image
        },
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      totalItems
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
