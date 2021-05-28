const express = require('express');

const {
  addShop,
  getAllShops,
  getShop,
  getShopByBranchId,
  updateShop,
  deleteShop,
  lockoutShop
} = require('../controllers/ShopController');

const router = express.Router();

router.post('/Shop', addShop);
router.get('/Shops', getAllShops);
router.get('/Shop/:id', getShop);
router.get('/Shop/BranchId/:id', getShopByBranchId);
router.put('/Shop/:id', updateShop);
router.delete('/Shop/:id', deleteShop);
router.put('/Shop/lockout/:id', lockoutShop);

module.exports = {
  routes: router,
};
