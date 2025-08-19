const express = require('express')
const { createProduct, singleProduct, updateProduct, deleteProduct, getAllProduct } = require('../controller/productController')
const  router  = express.Router();


router.route("/product/new").post(createProduct);
router.route("/product/:id").get(singleProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);
router.route("/products").get(getAllProduct);

module.exports = router