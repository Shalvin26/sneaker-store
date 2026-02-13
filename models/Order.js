const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    sneaker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sneaker',
      required: true
    },
    name: String,
    price: Number,
    size: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);