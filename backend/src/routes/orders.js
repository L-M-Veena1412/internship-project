const express = require('express');
const router  = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All order routes require login
router.use(protect);

router.post('/',    placeOrder);
router.get('/my',   getMyOrders);
router.get('/:id',  getOrderById);

module.exports = router;
