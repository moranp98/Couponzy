const firebase = require('../config/db_adminSdk');
const Coupon = require('../models/Shop');

const addShop = async (req, res, next) => {
  try {
    const data = req.body;
    await firebase.collection('Shops').doc().set(data);
    res.send('Shop record saved successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllShops = async (req, res, next) => {
  try {
    const shops = await firebase.collection('Shops');
    const data = await shops.get();
    const shopsArray = [];
    if (data.empty) {
      res.status(404).send('No shop record found');
    } else {
      data.forEach((doc) => {
        const shop = new Shop(doc.id, doc.data().name, doc.data().coupons);
        couponsArray.push(coupon);
      });

      res.send(couponsArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;
    const coupon = await firebase.collection('Coupons').doc(id);
    const data = await coupon.get();
    if (!data.exists) {
      res.status(404).send('Coupon with the given ID not found');
    } else {
      res.send(data.data());
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const coupon = await firebase.collection('Coupons').doc(id);
    await coupon.update(data);
    res.send('Coupon record updated successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firebase.collection('Coupons').doc(id).delete();
    res.send('Coupon record deleted successfuly');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  addCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
