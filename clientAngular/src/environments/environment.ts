// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const PORT = 8080;

export const environment = {
  production: false,

  serverUrl : `http://localhost:${PORT}/api`,
  
  branchesUrl : `http://localhost:${PORT}/api/branches`,
  shopsUrl : `http://localhost:${PORT}/api/shops`,
  couponTypesUrl : `http://localhost:${PORT}/api/couponTypes`,
  brandsUrl : `http://localhost:${PORT}/brands`,
  usersUrl : `http://localhost:${PORT}/api/user`,
  couponsUrl : `http://localhost:${PORT}/api`,
  ordersUrl : `http://localhost:${PORT}/api/orders`,
  adminsUrl : `http://localhost:${PORT}/admins`,
  shopssUrl : `http://localhost:${PORT}/shops`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
