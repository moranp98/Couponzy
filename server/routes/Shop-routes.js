const express = require('express');

const {
  addShop,
  getAllShops,
  getShop,
  updateShop,
  deleteShop,
} = require('../controllers/ShopController');

const router = express.Router();

router.post('/Shop', addShop);
router.get('/Shopes', getAllShops);
router.get('/Shop/:id', getShop);
router.put('/Shop/:id', updateShop);
router.delete('/Shop/:id', deleteShop);

module.exports = {
  routes: router,
};
