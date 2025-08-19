const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please entre the product name"]
    },
    description:{
        type:String,
        required:[true,"Please entre the product description"]
    },
    price:{
        type:Number,
        required:[true,"Please entre the product price"],
        max:[99999,"price can not be exceed 8 figures"]
    },
    category:{
        type:String,
        required:[true,"Please entre the product category"]
    },
    stock:{
        type:Number,
        required:[999,"Stock can not be exceed 999"],
        default:1
    },
    images:[{
            type:String,
            default:true
    }],
    review:[
        {
            name:{
                type:String,
                default:""
            },
            rating:{
                type:Number,
                default:0
            },
            comment:{
                type:String,
                default:""
            }
        }
    ],
    rating:{
        type:Number,
        default:0
    },
    numberOfReview:{
        type:String,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("Product",productSchema)