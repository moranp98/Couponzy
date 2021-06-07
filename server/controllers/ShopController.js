const firebase = require('../config/db_adminSdk');
const admin = require("firebase-admin");
const Shop = require('../models/Shop');

const addShop = async (req, res, next) => {
  try {
    const data = req.body;
    data.isExists = true;
    data.lastUpdated = admin.firestore.Timestamp.now();
    await firebase.collection('Shops').doc().set(data);
    res.json('Shop record saved successfuly');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAllShops = async (req, res, next) => {
  try {
    const shops = await firebase.collection('Shops');
    const data = await shops.get();
    const shopsArray = [];
    if (data.empty) {
      res.status(404).json('No shop record found');
    } else {
      data.forEach((doc) => {
        const shop = new Shop(
          doc.id,
          doc.data().shopName,
          doc.data().profile_Shop,
          doc.data().isExists,
          doc.data().lastUpdated,
          doc.data().coupons,
          doc.data().branches,
          doc.data().shopManagers 
        );
        shopsArray.push(shop);
      });
      res.json(shopsArray);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getShop = async (req, res, next) => {
  try {
    const id = req.params.id;
    const shop = await firebase.collection('Shops').doc(id);
    const data = await shop.get();
    if (!data.exists) {
      res.status(404).json('Shop with the given ID not found');
    } else {
      res.json(data.data());
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getShopByBranchId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const branch = await firebase.collection('Branches').doc(id);
    const data = await branch.get();
    const shopId = data.data().shop.id
    const currentShop = await firebase.collection('Shops').doc(shopId);
    const dataShop = await currentShop.get();
    if (!dataShop.data()) {
      res.status(404).json('Shop with the given ID not found');
    } else {
      res.json(dataShop.data());
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateShop = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    data.lastUpdated = admin.firestore.Timestamp.now();
    const shop = await firebase.collection('Shops').doc(id);
    await shop.update(data);

    const couponsRef = await firebase.collection('Coupons').where('shop.id', '==', id);
    couponsRef.get().then((query) => {
      query.docChanges().forEach(change => {
        const coupon = change.doc;
        const newShopInsidCoupon = {
          "id": id,
          "shopName": data.shopName,
          "profile_Shop": data.profile_Shop
        };
        coupon.ref.update({ 'shop': newShopInsidCoupon, lastUpdated: admin.firestore.Timestamp.now() });
      });
    });

    const branchesRef = await firebase.collection('Branches').where('shop.id', '==', id);
    branchesRef.get().then((query) => {
      query.docChanges().forEach(change => {
        const branch = change.doc;
        const newShopInsidBranch = {
          "id": id,
          "shopName": data.shopName,
          "profile_Shop": data.profile_Shop
        };
        branch.ref.update({ 'shop': newShopInsidBranch });
      });
    });

    const ordersRef = await firebase.collection('Orders').where('branch.shopId', '==', id);
    ordersRef.get().then((query) => {
      query.docChanges().forEach(change => {
        const shop = change.doc;
        const newShopInsidOrder = data.shopName
        shop.ref.update({ 'branch.shopName': newShopInsidOrder });
      });
    });

    res.json('Shop record updated successfuly');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

/*<--- deleteShop Not in used --->*/
const deleteShop = async (req, res, next) => {
  try {
    const id = req.params.id;
    await firebase.collection('Shops').doc(id).delete();
    res.json('Shop record deleted successfuly');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const lockoutShop = async (req, res, next) => {
  try {
    const id = req.params.id;
    const shop = await firebase.collection('Shops').doc(id);
    await shop.update({'isExists': false, lastUpdated: admin.firestore.Timestamp.now()});

    res.json('The shop has been successfully locked');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  addShop,
  getAllShops,
  getShop,
  getShopByBranchId,
  updateShop,
  deleteShop,
  lockoutShop
};
