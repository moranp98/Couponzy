const express = require('express');

const { addOrder,
        getAllOrders,
        getOrder,
        updateOrder,
        deleteOrder
      } = require('../controllers/OrderController');

const router = express.Router();

router.post('/Order', addOrder);
router.get('/Orders', getAllOrders);
router.get('/Order/:id', getOrder);
router.put('/Order/:id', updateOrder);
router.delete('/Order/:id', deleteOrder);

module.exports = {
    routes: router
}