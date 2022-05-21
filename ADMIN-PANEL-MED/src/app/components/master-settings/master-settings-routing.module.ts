import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from './master/master.component';
import { CategoryComponent } from './category/category.component';
import { BrandComponent } from './brand/brand.component';
import { UOMComponent } from './uom/uom.component';
import { UOMValueComponent } from './uomvalue/uomvalue.component';
import { TaxComponent } from './tax/tax.component';
import { DeliveryAreaComponent } from './delivery-area/delivery-area.component';
import { StoreCreationComponent } from './store-creation/store-creation.component';
import { PincodeComponent } from './pincode/pincode.component';
import { DeliveryChargeComponent } from './delivery-charge/delivery-charge.component';
import { PolicyComponent } from './policy/policy.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { SubSubCategoryComponent } from './sub-sub-category/sub-sub-category.component';
import { MedicineCategoryComponent } from './medicine-category/medicine-category.component';
import { PreferenceComponent } from './preference/preference.component';
import { MainPincodeComponent } from './main-pincode/main-pincode.component';


const routes: Routes = [
   {
        path: '',
        component: MasterComponent,
        
   },
  {
    path: 'category',
    component: CategoryComponent,
    
  },
  {
    path: 'brand',
    component: BrandComponent,
    
  },
  {
    path: 'UOM',
    component: UOMComponent,
    
  },
  {
    path: 'UOMValue',
    component: UOMValueComponent,
    
  },
  {
    path: 'tax',
    component: TaxComponent,
    
  },
  {
    path: 'delivery-area',
    component: DeliveryAreaComponent,
    
  },
  {
    path: 'store-creation',
    component: StoreCreationComponent,
    
  },
  {
    path: 'delivery-charge',
    component: DeliveryChargeComponent,
    
  },
  {
    path: 'policy',
    component: PolicyComponent,
    
  },
  {
    path: 'pin',
    component: MainPincodeComponent,
    
  },
  {
    path: 'sub-category/:healthSubCatgeoryID',
    component: SubCategoryComponent,
    
  },
  {
    path: 'sub-sub-category/:healthSubSubCatgeoryID',
    component: SubSubCategoryComponent,
    
  },
  {
    path: 'medicine-category/:medCatgeoryID',
    component: MedicineCategoryComponent,
    
  },
  {
    path: 'pincode/:parentStoreID',
    component: PincodeComponent,
    
  },
  {
    path: 'preference',
    component: PreferenceComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersettingsRoutingModule { }
