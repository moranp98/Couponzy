class Review {
    constructor(id, couponId, userId, review_text, published_date){
        this.id = id;
        this.couponId = couponId;
        this.userId = userId;
        this.review_text = review_text;
        this.published_date = published_date;
      }
  }
  
  module.exports = Review;