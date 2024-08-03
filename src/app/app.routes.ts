import { Routes } from '@angular/router';
import { AppRoutingPath } from './app-routing.path';
import { PromosBaseComponent } from './ui/promos/promos-base/promos-base.component';
import { RewardsBaseComponent } from './ui/rewards/rewards-base/rewards-base.component';
import { AccountsBaseComponent } from './ui/accounts/accounts-base/accounts-base.component';
import { ItemsBaseComponent } from './ui/items/items-base/items-base.component';

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

const rewardsRoutes: Routes = [
  {
    path: '',
    component: RewardsBaseComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './shared/components/choose-option-alert/choose-option-alert.component'
          ).then((value) => value.CHOOSE_OPTION_ALERT_ROUTES),
      },
    ],
  },
  {
    path: AppRoutingPath.REWARDS_SETTINGS.path,
    component: RewardsBaseComponent,
    children: [
      {
        path: AppRoutingPath.SEARCH_REWARDS_SETTINGS.path,
        loadChildren: () =>
          import(
            './ui/rewards/search-rewards-settings/search-rewards-settings.component'
          ).then((value) => value.SEARCH_REWARDS_SETTINGS_ROUTES),
      },
      {
        path: AppRoutingPath.EDIT_REWARDS_SETTINGS.path,
        data: {
          raw: false,
        },
        loadChildren: () =>
          import(
            './ui/rewards/rewards-settings-edit/rewards-settings-edit.component'
          ).then((value) => value.EDIT_REWARDS_SETTINGS_ROUTES),
      },
      {
        path: AppRoutingPath.CREATE_REWARDS_SETTINGS.path,
        data: {
          raw: false,
        },
        loadChildren: () =>
          import(
            './ui/rewards/rewards-settings-create/rewards-settings-create.component'
          ).then((value) => value.CREATE_REWARDS_SETTINGS_ROUTES),
      },
      {
        path: AppRoutingPath.EDIT_REWARDS_SETTINGS_RAW.path,
        data: {
          raw: true,
        },
        loadChildren: () =>
          import(
            './ui/rewards/rewards-settings-edit/rewards-settings-edit.component'
          ).then((value) => value.EDIT_REWARDS_SETTINGS_ROUTES),
      },
      {
        path: AppRoutingPath.CREATE_REWARDS_SETTINGS_RAW.path,
        data: {
          raw: true,
        },
        loadChildren: () =>
          import(
            './ui/rewards/rewards-settings-create/rewards-settings-create.component'
          ).then((value) => value.CREATE_REWARDS_SETTINGS_ROUTES),
      },
    ],
  },
];

const accountRoutes: Routes = [
  {
    path: '',
    component: AccountsBaseComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './shared/components/choose-option-alert/choose-option-alert.component'
          ).then((value) => value.CHOOSE_OPTION_ALERT_ROUTES),
      },
      {
        path: AppRoutingPath.ACCOUNTS_SEARCH_V1.path,
        loadChildren: () =>
          import(
            './ui/accounts/search-accounts/search-accounts.component'
          ).then((value) => value.SEARCH_ACCOUNTS_ROUTES),
      },
      {
        path: AppRoutingPath.ACCOUNTS_ADD_V2_RAW.path,
        loadChildren: () =>
          import('./ui/accounts/add-account/add-account.component').then(
            (value) => value.ADD_ACCOUNT_ROUTES,
          ),
      },
    ],
  },
];

const itemRoutes: Routes = [
  {
    path: '',
    component: ItemsBaseComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './shared/components/choose-option-alert/choose-option-alert.component'
          ).then((value) => value.CHOOSE_OPTION_ALERT_ROUTES),
      },
      {
        path: AppRoutingPath.ITEMS_SEARCH.path,
        loadChildren: () =>
          import('./ui/items/search-items/search-items.component').then(
            (value) => value.SEARCH_ITEMS_ROUTES,
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
    path: AppRoutingPath.REWARDS.path,
    children: rewardsRoutes,
  },
  {
    path: AppRoutingPath.ACCOUNTS.path,
    children: accountRoutes,
  },
  {
    path: AppRoutingPath.ITEMS.path,
    children: itemRoutes,
  },
  {
    path: '**',
    loadChildren: () =>
      import('./ui/not-found/not-found.component').then(
        (m) => m.NOT_FOUND_ROUTES,
      ),
  },
];
