const express = require('express');

const {
  addShop,
  getAllShops,
  getShop,
  updateShop,
  deleteShop,
  lockoutShop
} = require('../controllers/ShopController');

const router = express.Router();

router.post('/Shop', addShop);
router.get('/Shops', getAllShops);
router.get('/Shop/:id', getShop);
router.put('/Shop/:id', updateShop);
router.delete('/Shop/:id', deleteShop);
router.put('/Shop/lockout/:id', lockoutShop);

module.exports = {
  routes: router,
};
