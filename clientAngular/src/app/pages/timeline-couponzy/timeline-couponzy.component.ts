import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { TimelineCouponzyService } from '../../services/timeline-couponzy.service';
import { Reviews } from '../../models/reviews';

@Component({
  selector: 'timeline-couponzy',
  templateUrl: './timeline-couponzy.component.html',
  styleUrls: ['./timeline-couponzy.component.scss']
})
export class PageTimelineCouponzyComponent implements OnInit {
  pageTitle: string = 'דירוגים על ציר הזמן';
  timelineData_new_new: any[] = [];
  reviews: Reviews[] = [];

  constructor(private _sharedService: SharedService,
    private _manageTimelineCouponzy: TimelineCouponzyService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    this.showReviews();
  }

  showReviews() {
    this._manageTimelineCouponzy.getAllReviews().subscribe((reviews) => {
      this.reviews = reviews;
      const mapReviews = reviews.map(review => {
        return {
          label: new Date(review.published_date['_seconds'] * 1000).getFullYear(),
          date: review.published_date['_seconds'] * 1000,
          content: review.review_text,
          couponName: review.coupon.couponName,
          couponId: review.coupon.id,
          userName: review.user.firstName + ' ' + review.user.lastName,
          profile_User: review.user.profile_User,
          pointColor: '#FFC6E6'
        }
      });

      const sortTimelineByYear = mapReviews.sort((a, b) => (b.date) - (a.date));

      const updateDatetoLocaleString = sortTimelineByYear.map(review => {
        return {
          ...review, date: new Date(review.date).toLocaleString()
        }
      });

      const viewData = groupBy(updateDatetoLocaleString, review => review.label);

      console.log(viewData);

      let keys = [...viewData.keys()]

      console.log(keys);

      this.timelineData_new_new = keys.map(key => {
        return { label: key, timeline: viewData.get(key) }
      })
      console.log(this.timelineData_new_new);
    });
  }
}

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
       const key = keyGetter(item);
       const collection = map.get(key);
       if (!collection) {
           map.set(key, [item]);
       } else {
           collection.push(item);
       }
  });
  return map;
}