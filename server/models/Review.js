class Review {
    constructor(id, coupon, user, review_text, published_date){
        this.id = id;
        this.coupon = coupon;
        this.user = user;
        this.review_text = review_text;
        this.published_date = published_date;
      }
  }
  
  module.exports = Review;