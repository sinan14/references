import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from "./windows.service";
import  EmployeeService  from 'src/app/services/employee.service';
// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false

	constructor(@Inject(WINDOW) private window,private authService: EmployeeService) {
		
		this.authService.autoLogin();
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	
	public home_icon:any = '<img src="assets/images/dashboard/icon-home.png" class="menu-icon">';
	// Windows width
	@HostListener("window:resize", ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}


	MENUITEMS: Menu[] = [
		{
			path: '/dashboard', icon: 'grid', type: 'link', active: true
		},
		{
				path: '/customer-relation', icon: 'camera', type: 'link', active: false
		},
		
		{ 
			path: '/promo',  icon: 'clipboard', type: 'link' 
		},
		
		{ 
			path: '/orders',  icon: 'box', type: 'link' 
		},
		{
				 path: '/customer-details', icon: 'users', type: 'link', active: false
		},
		{ 
			path: '/users/create-user', icon : 'user-plus',  type: 'link' ,active: false
		},
		{ 
			path: '/medi-mall', icon : 'tag',  type: 'link' ,active: false
		},
		{ 
			path: '/medcoin', icon : 'dollar-sign',  type: 'link' ,active: false
		},
		{ 
			path: '/medimall-report', icon : 'box',  type: 'link' ,active: false
		},
		{ 
			path: '/complaints', icon : 'clipboard',  type: 'link' ,active: false
		},
		{ 
			path: '/fitness-wellness', icon : 'box',  type: 'link' ,active: false
		},
		{ 
			path: '/explore', icon : 'chrome',  type: 'link' ,active: false
		},
		
		{ 
			path: '/premium', icon : 'box',  type: 'link' ,active: false
		},
		
		{ 
			path: '/subscriptions', icon : 'clipboard',  type: 'link' ,active: false
		},
		{ 
			path: '/user-management', icon : 'tag',  type: 'link' ,active: false
		},
		{ 
			path: '/master-settings', icon : 'settings',  type: 'link' ,active: false
		},
		// { 
		// 	path: '/settings/profile',  icon: 'settings', type: 'link' 
		// },
		// { path: '/sales/orders',  icon: 'dollar-sign', type: 'link' },
		// {
		// 	path: '/invoice', icon: 'archive', type: 'link', active: false
		// },
		// {
		// 	path: '/auth/login', icon: 'log-in', type: 'link', active: false
		// },
		// {
		// 	title: 'Products', icon: 'box', type: 'sub', active: false, children: [
		// 		{
		// 			title: 'Physical', type: 'sub', children: [
		// 				{ path: '/products/physical/category', title: 'Category', type: 'link' },
		// 				{ path: '/products/physical/sub-category', title: 'Sub Category', type: 'link' },
		// 				{ path: '/products/physical/product-list', title: 'Product List', type: 'link' },
		// 				{ path: '/products/physical/product-detail', title: 'Product Detail', type: 'link' },
		// 				{ path: '/products/physical/add-product', title: 'Add Product', type: 'link' },
		// 			]
		// 		},
		// {
		// 		title: 'Products', icon: 'box', type: 'sub', active: false, children: [
		// 		{
		// 			title: 'digital', type: 'sub', children: [
		// 				{ path: '/products/digital/digital-category', title: 'Category', type: 'link' },
		// 				{ path: '/products/digital/digital-sub-category', title: 'Sub Category', type: 'link' },
		// 				{ path: '/products/digital/digital-product-list', title: 'Product List', type: 'link' },
		// 				{ path: '/products/digital/digital-add-product', title: 'Add Product', type: 'link' },
		// 			]
		// 		},
		// 	]
		// },
		// {
		// 	title: 'Sales', icon: 'dollar-sign', type: 'sub', active: false, children: [
		// 		{ path: '/sales/orders', title: 'Orders', type: 'link' },
		// 		{ path: '/sales/transactions', title: 'Transactions', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Coupons', icon: 'tag', type: 'sub', active: false, children: [
		// 		{ path: '/coupons/list-coupons', title: 'List Coupons', type: 'link' },
		// 		{ path: '/coupons/create-coupons', title: 'Create Coupons', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Team Management', icon: 'clipboard', type: 'sub', active: false, children: [
		// 		{ path: '/pages/list-page', title: 'List Page', type: 'link' },
		// 		{ path: '/pages/create-page', title: 'Create Page', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Media', path: '/media', icon: 'camera', type: 'link', active: false
		// },
		// // {
		// // 	title: 'Teammanagement', path: '/teammanagement', icon: 'camera', type: 'link', active: false
		// // },
		// {
		// 	title: 'Menus', icon: 'align-left', type: 'sub', active: false, children: [
		// 		{ path: '/menus/list-menu', title: 'Menu Lists', type: 'link' },
		// 		{ path: '/menus/create-menu', title: 'Create Menu', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Users', icon: 'user-plus', type: 'sub', active: false, children: [
		// 		{ path: '/users/list-user', title: 'User List', type: 'link' },
		// 		{ path: '/users/create-user', title: 'Create User', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Vendors', icon: 'users', type: 'sub', active: false, children: [
		// 		{ path: '/vendors/list-vendors', title: 'Vendor List', type: 'link' },
		// 		{ path: '/vendors/create-vendors', title: 'Create Vendor', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Localization', icon: 'chrome', type: 'sub', children: [
		// 		{ path: '/localization/translations', title: 'Translations', type: 'link' },
		// 		{ path: '/localization/currency-rates', title: 'Currency Rates', type: 'link' },
		// 		{ path: '/localization/taxes', title: 'Taxes', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Customer Details', path: '/reports', icon: 'bar-chart', type: 'link', active: false
		// },
		// {
		// 	title: 'Settings', icon: 'settings', type: 'sub', children: [
		// 		{ path: '/settings/profile', title: 'Profile', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Invoice', path: '/invoice', icon: 'archive', type: 'link', active: false
		// },
		// {
		// 	title: 'Login',path: '/auth/login', icon: 'log-in', type: 'link', active: false
		// }
	]
	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
