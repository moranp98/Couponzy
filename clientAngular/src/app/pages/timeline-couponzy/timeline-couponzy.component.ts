import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../layouts/shared.service';
import { TimelineCouponzyService } from '../../services/timeline-couponzy.service';
import { ManageShopsService } from 'src/app/services/manage-shops.service';
import { ManageBranchesService } from 'src/app/services/manage-branches.service';
import { Reviews } from '../../models/reviews';
import { Users } from '../../models/users';
import { Shops } from 'src/app/models/shops';
import { Branches } from 'src/app/models/branches';

@Component({
  selector: 'timeline-couponzy',
  templateUrl: './timeline-couponzy.component.html',
  styleUrls: ['./timeline-couponzy.component.scss']
})
export class PageTimelineCouponzyComponent implements OnInit {
  pageTitle: string = 'דירוגים על ציר הזמן';
  timelineData_new_new: any[] = [];
  reviews: Reviews[] = [];
  currentShop: Shops;
  currentBranch: Branches;
  currentUser: Users;
  shopId: string = '';

  constructor(private _sharedService: SharedService,
    private _manageTimelineCouponzy: TimelineCouponzyService,
    private _manageshops: ManageShopsService,
    private _managebranches: ManageBranchesService) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {
    var currentUser = localStorage.getItem('userDetails');
    this.currentUser = JSON.parse(currentUser)

    this.showReviews(this.currentUser.employerId);
  }

  showReviews(employerId: string) {
    switch (this.currentUser.role) {
      case 'shopManager':
        this._manageshops.getShopById(employerId).subscribe((shop) => {
          this.currentShop = shop;
          this.loadTimeline();
        });
        break;
      case 'seller':
        this.loadBranch(employerId);
        break;
      default: //role --> 'admin'
        this.loadTimeline();
        break;
    }
  }

  loadBranch(employerId: string) {
    this._managebranches.getBranchById(employerId).subscribe((branch) => {
      this.currentBranch = branch;
      this.shopId = this.currentBranch.shop.id;
      this.loadShop()
    })
  }

  loadShop() {
    this._manageshops.getShopById(this.shopId).subscribe((shop) => {
      this.currentShop = shop;
      this.loadTimeline();
    });
  }

  loadTimeline() {
    this._manageTimelineCouponzy.getAllReviews().subscribe((reviews) => {
      switch (this.currentUser.role) {
        case 'shopManager':
          this.reviews = reviews
          .filter(review => this.currentShop.coupons
            .findIndex(function (couponId) { return couponId.id === review.coupon.id }) !== -1);
          break;
        case 'seller':
          this.reviews = reviews
          .filter(review => this.currentShop.coupons
            .findIndex(function (couponId) { return couponId.id === review.coupon.id }) !== -1);
          break;
        default: //role --> 'admin'
          this.reviews = reviews
          break;
      }

      console.log(this.reviews);

      const mapReviews = this.reviews.map(review => {
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