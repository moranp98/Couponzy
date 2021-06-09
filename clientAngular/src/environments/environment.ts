// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const PORT = 8080;

export const environment = {
  production: false,

  serverUrl : `http://193.106.55.144:${PORT}/api`,
  
  branchesUrl : `http://193.106.55.144:${PORT}/api/branches`,
  shopsUrl : `http://193.106.55.144:${PORT}/api/shops`,
  couponTypesUrl : `http://193.106.55.144:${PORT}/api/couponTypes`,
  brandsUrl : `http://193.106.55.144:${PORT}/brands`,
  usersUrl : `http://193.106.55.144:${PORT}/api/user`,
  couponsUrl : `http://193.106.55.144:${PORT}/api`,
  ordersUrl : `http://193.106.55.144:${PORT}/api/orders`,
  shopssUrl : `http://193.106.55.144:${PORT}/shops`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
