const res = require('express/lib/response');
const { findById } = require('../model/productModel');
const Product = require('../model/productModel');


//Create Product
exports.createProduct = async (req,res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({
            success:true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//Get Product

exports.singleProduct = async (req,res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//Update Product
exports.updateProduct = async (req,res) => {
    try {
        let product = await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            product
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//Delete Product
exports.deleteProduct = async(req,res) => {
    try {
        let product = await Product.findById(req.params.id)
        if(!product){
            res.status(404).json({
                success:true,
                message:"Product not found"
            })
        }
        product = await Product.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success:true,
            message:"Product Deleted Successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//Get All Product
exports.getAllProduct = async(req,res) =>{
    try {
        const products = await Product.find()
    if(products.length ===0){
        res.status(200).json({
            success:true,
            message:" No Products found",
            products: []
        })
    }
    res.status(200).json({
        success:true,
        message:" All Products retrieved successfully",
        count: products.length,
        products
    })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }

}
