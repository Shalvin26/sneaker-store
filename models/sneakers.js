const mongoose=require('mongoose');

const sneakerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    image:{
       type:String,
        required:true 
    },
    description:{
        type:String,
        
    },category: { type: String, default: 'Sneakers' },
       color: { type: String },
       material: { type: String },
       availableSizes: [Number],  // Array of sizes: [8, 9, 10, 11, 12]
       stock: { type: Number, default: 10 },
       featured: { type: Boolean, default: false },
       specifications: {
        weight: String,
        sole: String,
        technology: String
  }
} ,{timestamps:true});


module.exports=mongoose.model('Sneaker',sneakerSchema);