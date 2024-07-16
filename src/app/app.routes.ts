import { Routes } from '@angular/router';
import { AppRoutingPath } from './app-routing.path';
import { PromosBaseComponent } from './ui/promos/promos-base/promos-base.component';

export const promoRoutes: Routes = [
  {
    path: '',
    component: PromosBaseComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './shared/components/choose-option-alert/choose-option-alert.component'
          ).then((value) => value.CHOOSE_OPTION_ALERT_ROUTES),
      },
      {
        path: AppRoutingPath.SEARCH_PROMOS_V3.path,
        loadChildren: () =>
          import(
            './ui/promos/promotions/search-promotions/search-promotions.component'
          ).then((value) => value.SEARCH_PROMOTIONS_ROUTES),
      },
      {
        path: AppRoutingPath.CREATE_PROMO.path,
        loadChildren: () =>
          import(
            './ui/promos/promotions/add-promotion/add-promotion.component'
          ).then((value) => value.ADD_PROMOTION_ROUTES),
      },
      {
        path: AppRoutingPath.SEARCH_DEALS.path,
        loadChildren: () =>
          import('./ui/promos/deals/search-deals/search-deals.component').then(
            (value) => value.SEARCH_DEALS_ROUTES,
          ),
      },
      {
        path: AppRoutingPath.CREATE_DEAL.path,
        loadChildren: () =>
          import('./ui/promos/deals/add-deal/add-deal.component').then(
            (value) => value.ADD_DEALS_ROUTES,
          ),
      },
    ],
  },
];

export const routes: Routes = [
  {
    path: AppRoutingPath.HOME.path,
    loadChildren: () =>
      import('./ui/home/home.component').then((value) => value.HOME_ROUTES),
  },
  {
    path: AppRoutingPath.PROMOS.path,
    children: promoRoutes,
  },
  {
    path: '**',
    loadChildren: () =>
      import('./ui/not-found/not-found.component').then(
        (m) => m.NOT_FOUND_ROUTES,
      ),
  },
];
