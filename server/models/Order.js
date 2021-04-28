class Order { 
    constructor(id, orderNumber, orderDate, coupon, branch, user){
        this.id = id;
        this.orderNumber = orderNumber;
        this.orderDate = orderDate;
        this.coupon = coupon;
        this.branch = branch;
        this.user = user;
    }
}

module.exports = Order;
