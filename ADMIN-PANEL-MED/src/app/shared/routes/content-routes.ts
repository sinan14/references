import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'products',
    loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule),
    data: {
      breadcrumb: "Products"
    }
  },
  {
    path: 'sales',
    loadChildren: () => import('../../components/sales/sales.module').then(m => m.SalesModule),
    data: {
      breadcrumb: "Sales"
    }
  },
  {
    path: 'coupons',
    loadChildren: () => import('../../components/coupons/coupons.module').then(m => m.CouponsModule),
    data: {
      breadcrumb: "Coupons"
    }
  },
  {
    path: 'pages',
    loadChildren: () => import('../../components/pages/pages.module').then(m => m.PagesModule),
    data: {
      breadcrumb: "Pages"
    }
  },
  {
    path: 'menus',
    loadChildren: () => import('../../components/menus/menus.module').then(m => m.MenusModule),
    data: {
      breadcrumb: "Menus"
    }
  },
  {
    path: 'users',
    loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule),
    data: {
      breadcrumb: "Users"
    }
  },
  {
    path: 'vendors',
    loadChildren: () => import('../../components/vendors/vendors.module').then(m => m.VendorsModule),
    data: {
      breadcrumb: "Vendors"
    }
  },
  {
    path: 'localization',
    loadChildren: () => import('../../components/localization/localization.module').then(m => m.LocalizationModule),
    data: {
      breadcrumb: "Localization"
    }
  },
  {
    path: 'reports',
    loadChildren: () => import('../../components/reports/reports.module').then(m => m.ReportsModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('../../components/setting/setting.module').then(m => m.SettingModule),
    data: {
      breadcrumb: "Settings"
    }
  },
  {
    path: 'invoice',
    loadChildren: () => import('../../components/invoice/invoice.module').then(m => m.InvoiceModule),
    data: {
      breadcrumb: "Invoice"
    }
  },
  {
    path: 'event',
    loadChildren: () => import('../../components/event/event.module').then(m => m.EventModule),
  
  },
  {
    path: 'task',
    loadChildren: () => import('../../components/task/task.module').then(m => m.TaskModule),
  
  },
  {
    path: 'customer-details',
    loadChildren: () => import('../../components/customer-details/customer-details.module').then(m => m.CustomerDetailsModule),
  
  },
  {
    path: 'medi-mall',
    loadChildren: () => import('../../components/medi-mall/medi-mall.module').then(m => m.MediMallModule),
  
  },
  {
    path: 'promo',
    loadChildren: () => import('../../components/promo/promo.module').then(m => m.PromoModule),
  
  },
  {
    path: 'orders',
    loadChildren: () => import('../../components/orders/orders.module').then(m => m.OrdersModule),
  
  },
  {
    path: 'inventory',
    loadChildren: () => import('../../components/inventory-management/inventory-management.module').then(m => m.InventoryManagementModule),
  
  },
  {
    path: 'medcoin',
    loadChildren: () => import('../../components/medicoin/medicoin.module').then(m => m.MedicoinModule),
  
  },
  {
    path: 'medimall-report',
    loadChildren: () => import('../../components/medimall-report/medimall-report.module').then(m => m.MedimallReportModule),
  
  },
  {
    path: 'complaints',
    loadChildren: () => import('../../components/complaints/complaints.module').then(m => m.ComplaintsModule),
  
  },
  {
    path: 'fitness-wellness',
    loadChildren: () => import('../../components/fitness-wellness/fitness-wellness.module').then(m => m.FitnessWellnessModule),
  
  },
  {
    path: 'explore',
    loadChildren: () => import('../../components/explore/explore.module').then(m => m.ExploreModule),
  
  },
  {
    path: 'premium',
    loadChildren: () => import('../../components/premium-members/premium-members.module').then(m => m.PremiumMembersModule),
  
  },
  {
    path: 'subscriptions',
    loadChildren: () => import('../../components/subscriptions/subscriptions.module').then(m => m.SubscriptionsModule),
  
  },
  
  {
    path: 'user-management',
    loadChildren: () => import('../../components/user-management/user-management.module').then(m => m.UserManagementModule),
  
  },
  {
    path: 'master-settings',
    loadChildren: () => import('../../components/master-settings/master-settings.module').then(m => m.MasterSettingsModule),
  
  },
  {
    path: 'email',
    loadChildren: () => import('../../components/email/email.module').then(m => m.EmailModule),
  
  },
  {
    path: 'customer-relation',
    loadChildren: () => import('../../components/customer-relation/customer-relation.module').then(m => m.CustomerRelationModule),
  
  },
  
  {
    path: 'team-management',
    loadChildren: () => import('../../components/team-management/team-management.module').then(m => m.TeamManagementModule),
  
  },
  {
    path: 'ads',
    loadChildren: () => import('../../components/ads/ads.module').then(m => m.AdsModule),
  },
  {
    path: 'pos',
    loadChildren: () => import('../../components/pos/pos.module').then(m => m.PosModule),
  },
  {
    path: 'delivery-boys',
    loadChildren: () => import('../../components/delivery-boy/delivery-boy.module').then(m => m.DeliveryBoyModule),
  },
  {
    path: 'suggested-product',
    loadChildren: () => import('../../components/suggested-product/suggested-product.module').then(m => m.SuggestedProductModule),
  },
  {
    path: 'delivery-doctors',
    loadChildren: () => import('../../components/delivery-doctors/delivery-doctor.module').then(m => m.DeliveryDoctorsModule),
  },
  {
    path: 'prescriptions',
    loadChildren: () => import('../../components/prescriptions/prescriptions.module').then(m => m.PrescriptionsModule),
  },
];