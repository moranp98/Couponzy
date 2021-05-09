const firebase = require('../config/db_adminSdk');
const Order = require('../models/Order');

const addOrder = async (req, res, next) => {
    try {
        const data = req.body;
        await firebase.collection('Orders').doc(data.orderNumber).set(data);
        res.json('Order record saved successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await firebase.collection('Orders');
        const data = await orders.get();
        const ordersArray = [];
        if (data.empty) {
            res.status(404).json('No order record found');
        } else {
            data.forEach(doc => {
                const order = new Order(
                    doc.id,
                    doc.data().orderNumber,
                    doc.data().orderDate,
                    doc.data().coupon,
                    thdoc.data().branch,
                    doc.data().user
                );
                ordersArray.push(order);
            });
            res.json(ordersArray);
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await firebase.collection('Orders').doc(id);
        const data = await order.get();
        if (!data.exists) {
            res.status(404).json('Order with the given ID not found');
        } else {
            res.json(data.data());
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const updateOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const order = await firebase.collection('Orders').doc(id);
        await order.update(data);
        res.json('Order record updated successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const deleteOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firebase.collection('Orders').doc(id).delete();
        res.json('Order record deleted successfuly');
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    addOrder,
    getAllOrders,
    getOrder,
    updateOrder,
    deleteOrder
}