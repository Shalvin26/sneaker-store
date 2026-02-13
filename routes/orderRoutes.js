const express = require('express');
const router = express.Router();
const orderController = require('../orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/', orderController.createOrder);  // Anyone can create order
router.get('/number/:orderNumber', orderController.getOrderByNumber);  // Track order by number

// Protected routes (admin only)
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.get('/:id', verifyToken, isAdmin, orderController.getOrderById);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);
router.delete('/:id', verifyToken, isAdmin, orderController.deleteOrder);

module.exports = router;