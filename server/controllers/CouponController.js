const firebase = require('../config/db_adminSdk');
const admin = require('firebase-admin');
const Coupon = require('../models/Coupon');

const addCoupon = async (req, res, next) => {
  try {
    const data = req.body;
    data.ratingAvg = 0;
    data.numOf_rating = 0;
    data.isExists = true;
    data.lastUpdated = admin.firestore.Timestamp.now();
    data.published = admin.firestore.Timestamp.now();
    console.log(data);

    await firebase.collection('Coupons').doc(data.couponId).set(data);

    const docId = data.shop.id;
    console.log(docId);
    const shopsRef = await firebase.collection('Shops').doc(docId);
    shopsRef.update({
      coupons: admin.firestore.FieldValue.arrayUnion({ id: data.couponId }),
    });

    const couponTypeId = data.couponType.id;
    console.log(couponTypeId);
    const couponTypeRef = await firebase
      .collection('CouponTypes')
      .doc(couponTypeId);
    couponTypeRef.update({
      countOf_Coupons: admin.firestore.FieldValue.increment(1),
    });

    res.json('Coupon record saved successfuly');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await firebase.collection('Coupons');
    const data = await coupons.get();
    const couponsArray = [];
    if (data.empty) {
      res.status(404).json('No coupon record found');
    } else {
      data.forEach((doc) => {
        const coupon = new Coupon(
          doc.id,
          doc.data().couponName,
          doc.data().description,
          doc.data().couponId,
          doc.data().profile_Coupon,
          doc.data().oldPrice,
          doc.data().newPrice,
          doc.data().published,
          doc.data().expireDate,
          doc.data().ratingAvg,
          doc.data().numOf_rating,
          doc.data().isExists,
          doc.data().lastUpdated,
          doc.data().couponType,
          doc.data().shop
        );
        couponsArray.push(coupon);
      });

      res.json(couponsArray);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;
    const coupon = await firebase.collection('Coupons').doc(id);
    const data = await coupon.get();
    if (!data.exists) {
      res.status(404).json('Coupon with the given ID not found');
    } else {
      res.json(data.data());
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const coupon = await firebase.collection('Coupons').doc(id);
    data.lastUpdated = admin.firestore.Timestamp.now();
    await coupon.update(data);

    const reviewsRef = await firebase
      .collection('Reviews')
      .where('coupon.id', '==', id);
    reviewsRef.get().then((query) => {
      query.docChanges().forEach((change) => {
        const review = change.doc;
        const newCouponInsidReview = {
          id: data.couponId,
          couponName: data.couponName,
          profile_Coupon: data.profile_Coupon,
        };
        review.ref.update({ coupon: newCouponInsidReview });
      });
    });

    const starsRef = await firebase
      .collection('Stars')
      .where('coupon.id', '==', id);
    starsRef.get().then((query) => {
      query.docChanges().forEach((change) => {
        const star = change.doc;
        const newCouponInsidStar = {
          id: data.couponId,
          couponName: data.couponName,
          profile_Coupon: data.profile_Coupon,
        };
        star.ref.update({ coupon: newCouponInsidStar });
      });
    });

    const ordersRef = await firebase
      .collection('Orders')
      .where('coupon.id', '==', id);
    ordersRef.get().then((query) => {
      query.docChanges().forEach((change) => {
        const order = change.doc;
        const newCouponNameInsidCoupon = data.couponName;
        const newCouponDescriptionInsidCoupon = data.description;
        const newCouponProfile_CouponInsidCoupon = data.profile_Coupon;
        order.ref.update({ 
          'coupon.couponName': newCouponNameInsidCoupon,
          'coupon.description': newCouponDescriptionInsidCoupon,
          'coupon.profile_Coupon': newCouponProfile_CouponInsidCoupon,
        });
      });
    });

    res.json('Coupon record updated successfuly');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

/*<--- deleteCoupon Not in used --->*/
const deleteCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;

    const coupon = await firebase.collection('Coupons').doc(id).get();
    const couponTypeId = coupon.data().couponType.id;
    const couponTypeRef = await firebase
      .collection('CouponTypes')
      .doc(couponTypeId);
    couponTypeRef.update({
      countOf_Coupons: admin.firestore.FieldValue.increment(-1),
    });

    await firebase.collection('Coupons').doc(id).delete();
    res.json('Coupon record deleted successfuly');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const lockoutCoupon = async (req, res, next) => {
  try {
    const id = req.params.id;
    const coupon = await firebase.collection('Coupons').doc(id);
    await coupon.update({'isExists': false, lastUpdated: admin.firestore.Timestamp.now()});

    const docShopId = (await coupon.get()).data().shop.id;
    console.log('data().shop.id = ' + docShopId)
    const shopsRef = await firebase.collection('Shops').doc(docShopId);
    shopsRef.update({
      coupons: admin.firestore.FieldValue.arrayRemove({'id': id})
    });

    const docCouponTypeId = (await coupon.get()).data().couponType.id;
    console.log('data().couponType.id = ' + docCouponTypeId)
    const couponTypeRef = await firebase.collection('CouponTypes').doc(docCouponTypeId);
    couponTypeRef.update({
      countOf_Coupons: admin.firestore.FieldValue.increment(-1),
    });

    res.json('The coupon has been successfully locked');
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// <--   Another functions    -->

const getCountCoupons = async (req, res, next) => {
  try {
    var size = 0
    const countOfCoupons = await firebase
      .collection('Coupons')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.docChanges().forEach(query => {
          const coupon = query.doc;
          const today = new Date(Date.now());
          const expireDate = new Date(coupon.data().expireDate)
          if (expireDate >= today) {
            size++;
          }
        })
      });

    res.status(200).json(size.toString());

  } catch (error) {
    res.status(400).json(error.message);
  }
}

const getCountValidCoupons = async (req, res, next) => {
  try {
    var size = 0
    const countOfValidCoupons = await firebase
      .collection('Coupons')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.docChanges().forEach(query => {
          const coupon = query.doc;
          const today = new Date(Date.now());
          const expireDate = new Date(coupon.data().expireDate)
          if (expireDate < today && coupon.data().isExists) {
            size++;
          }
        })
      });
    res.status(200).json(size.toString());
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  addCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  lockoutCoupon,
  getCountCoupons,
  getCountValidCoupons,
};
