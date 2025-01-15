import { Routes } from '@angular/router';
import { AppRoutingPath } from './app-routing.path';
import { PromosBaseComponent } from './ui/promos/promos-base/promos-base.component';
import { RewardsBaseComponent } from './ui/rewards/rewards-base/rewards-base.component';
import { AccountsBaseComponent } from './ui/accounts/accounts-base/accounts-base.component';
import { ItemsBaseComponent } from './ui/items/items-base/items-base.component';
import { ProductAssortmentBaseComponent } from './ui/product-assortment/product-assortment-base/product-assortment-base.component';
import { OrdersInvoicesBaseComponent } from './ui/orders-invoices/orders-invoices-base/orders-invoices-base.component';

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
      {
        path: AppRoutingPath.EDIT_DEAL.path,
        loadChildren: () =>
          import('./ui/promos/deals/edit-deal/edit-deal.component').then(
            (value) => value.EDIT_DEALS_ROUTES,
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
  {
    path: AppRoutingPath.REWARDS_SEGMENTATION.path,
    component: RewardsBaseComponent,
    children: [
      {
        path: AppRoutingPath.SEARCH_SEGMENTATION_GROUPS.path,
        loadChildren: () =>
          import(
            './ui/rewards-segmentation/search-segmentation-groups/search-segmentation-groups.component'
          ).then((value) => value.SEARCH_SEGMENTATION_GROUPS_ROUTES),
      },
      {
        path: AppRoutingPath.SEARCH_SEGMENTATION_GROUPS_BY_ACCOUNT.path,
        loadChildren: () =>
          import(
            './ui/rewards-segmentation/search-segmentation-groups-by-account/search-segmentation-groups-by-account.component'
          ).then((value) => value.SEARCH_SEGMENTATION_GROUPS_BY_ACCOUNT_ROUTES),
      },
      {
        path: AppRoutingPath.CREATE_SEGMENTATION_GROUP.path,
        loadChildren: () =>
          import(
            './ui/rewards-segmentation/create-segment-group/create-segment-group.component'
          ).then((value) => value.CREATE_SEGMENT_GROUP_ROUTES),
      },
    ],
  },
  {
    path: AppRoutingPath.REWARDS_CHALLENGES.path,
    component: RewardsBaseComponent,
    children: [
      {
        path: AppRoutingPath.SEARCH_CHALLENGES.path,
        loadChildren: () =>
          import(
            './ui/rewards-challenges/search-challenges/search-challenges.component'
          ).then((value) => value.SEARCH_CHALLENGES_ROUTES),
      },
      {
        path: AppRoutingPath.CREATE_CHALLENGE.path,
        loadChildren: () =>
          import(
            './ui/rewards-challenges/create-challenge/create-challenge.component'
          ).then((value) => value.CREATE_CHALLENGES_ROUTES),
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
      {
        path: AppRoutingPath.DELIVERY_WINDOWS_ADD.path,
        loadChildren: () =>
          import(
            './ui/accounts/add-delivery-window/add-delivery-window.component'
          ).then((value) => value.ADD_DELIVERY_WINDOW_ROUTES),
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
      {
        path: AppRoutingPath.ITEMS_ADD_RAW.path,
        loadChildren: () =>
          import('./ui/items/add-item/add-item.component').then(
            (value) => value.ADD_ITEM_ROUTES,
          ),
      },
      {
        path: AppRoutingPath.ITEMS_UPLOAD_IMAGES.path,
        loadChildren: () =>
          import(
            './ui/items/upload-item-images/upload-item-images.component'
          ).then((value) => value.UPLOAD_ITEM_IMAGES_ROUTES),
      },
      {
        path: AppRoutingPath.ITEMS_ADD_INVENTORY.path,
        loadChildren: () =>
          import('./ui/inventory/add-inventory/add-inventory.component').then(
            (value) => value.ADD_INVENTORY_ROUTES,
          ),
      },
      {
        path: AppRoutingPath.CATEGORIES.path,
        children: [
          {
            path: AppRoutingPath.CATEGORY_SEARCH_V3.path,
            loadChildren: () =>
              import(
                './ui/categories/search-categories/search-categories.component'
              ).then((value) => value.SEARCH_CATEGORIES_ROUTES),
          },
          {
            path: AppRoutingPath.CATEGORY_UPLOAD_IMAGES.path,
            loadChildren: () =>
              import(
                './ui/categories/upload-category-images/upload-category-images.component'
              ).then((value) => value.UPLOAD_CATEGORY_IMAGES_ROUTES),
          },
          {
            path: AppRoutingPath.CATEGORY_BULK_CREATE.path,
            loadChildren: () =>
              import(
                './ui/categories/bulk-create-categories/bulk-create-categories.component'
              ).then((value) => value.BULK_CREATE_CATEGORIES_ROUTES),
          },
        ],
      },
    ],
  },
];

const productAssortmentRoutes: Routes = [
  {
    path: '',
    component: ProductAssortmentBaseComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './shared/components/choose-option-alert/choose-option-alert.component'
          ).then((value) => value.CHOOSE_OPTION_ALERT_ROUTES),
      },
      {
        path: AppRoutingPath.ASSORTMENT_INCLUSION_V4.path,
        loadChildren: () =>
          import(
            './ui/product-assortment/assortment-inclusion/assortment-inclusion.component'
          ).then((value) => value.ASSORTMENT_INCLUSION_ROUTES),
      },
    ],
  },
];

const orderInvoiceRoutes: Routes = [
  {
    path: '',
    component: OrdersInvoicesBaseComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            './shared/components/choose-option-alert/choose-option-alert.component'
          ).then((value) => value.CHOOSE_OPTION_ALERT_ROUTES),
      },
      {
        path: AppRoutingPath.ORDERS_AND_INVOICES_SEARCH_ORDERS.path,
        loadChildren: () =>
          import(
            './ui/orders-invoices/search-orders/search-orders.component'
          ).then((value) => value.SEARCH_ORDERS_ROUTES),
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
    path: AppRoutingPath.LOGIN.path,
    loadChildren: () =>
      import('./ui/login/login.component').then((value) => value.LOGIN_ROUTES),
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
    path: AppRoutingPath.ASSORTMENT.path,
    children: productAssortmentRoutes,
  },
  {
    path: AppRoutingPath.ORDERS_AND_INVOICES.path,
    children: orderInvoiceRoutes,
  },
  {
    path: '**',
    loadChildren: () =>
      import('./ui/not-found/not-found.component').then(
        (m) => m.NOT_FOUND_ROUTES,
      ),
  },
];
