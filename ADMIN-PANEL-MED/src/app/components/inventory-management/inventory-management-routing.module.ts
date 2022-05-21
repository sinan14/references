import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddinventoryHealthcareComponent } from './addinventory-healthcare/addinventory-healthcare.component';
import { StockComponent } from './stock/stock.component';
import { ExpiryInventoryComponent } from './expiry-inventory/expiry-inventory.component';
import { MostBuyedComponent } from './most-buyed/most-buyed.component';
import { MostSearchComponent } from './most-search/most-search.component';
import { FavouriteComponent } from './favourite/favourite.component';


const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
  },
  {
    path: 'add-inventory/medicine',
    component: AddInventoryComponent,
  },
  {
    path: 'edit-inventory/medicine/:id',
    component: AddInventoryComponent,
  },
  {
    path: 'inventory-list/:type',
    component: InventoryListComponent,
  },
  {
    path: 'add-new-product',
    component: AddNewProductComponent,
  },
  {
    path: 'add-inventory/healthcare',
    component: AddinventoryHealthcareComponent,
  },
  {
    path: 'edit-inventory/healthcare/:id',
    component: AddinventoryHealthcareComponent,
  },
  {
    path: 'stock/:type',
    component: StockComponent,
  },
  {
    path: 'expiry',
    component: ExpiryInventoryComponent,
  },
  {
    path: 'buyed/:type',
    component: MostBuyedComponent,
  },
  {
    path: 'searched/:type',
    component: MostSearchComponent,
  },
  {
    path: 'favourite/:type',
    component: FavouriteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventorymanagementRoutingModule { }
