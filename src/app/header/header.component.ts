import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../services/authenticate.service';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../services/search.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showMenu = false;
  searchString = '';
  subscription: Subscription;
  showSearch: any = false;
  supplierId: any;
  noInventorySelected: any ='prod_name';
  coasterLogo = '../assets/images/coaster-logo.png';
  noInventoryAttr = [
    {name: 'Product Name', value: 'ProductsName'},
    {name: 'Supplier SKU', value: 'SupplierSKU'},
    {name: 'Inhabitr SKU', value: 'InhabitrSKU'},
  ];
  searchValue: any;
  navLinks = [
    {name:'Dashboard',url:'/admin/dashboard'},
    {name:'Products',url:'/admin/products/list'},
    {name:'Projects',url:'/admin/projects/list'},
    {name:'Moodboards',url:'/admin/moodboard/list/all'},
    {name:'Quotes',url:'/admin/quote/list/all'},
    {name:'Orders',url:'/admin/quote/orders/all'},
    {name:'Configuration',url:'/admin/B2Borderconfig'}
  ]
  navigationQueryParam:any;
  hideNav:boolean = true
  constructor(
    public auth: AuthenticateService,
    private rte: Router,
    private searchSer: SearchService,
     private ls: LocalStorageService,
     private router: Router,
     private _router : ActivatedRoute) {

      this.router.events.subscribe((event:any) => {
        if(event instanceof ActivationEnd) {
         let e:any = event;      
         console.log(e.snapshot.routeConfig.path)            
         if(e.snapshot.routeConfig.path == "imageLens" || e.snapshot.routeConfig.path == "roombuilder"){
          this.hideNav = false
         }
        }
    
      })

    }

  toggleMenu() {
    this.showMenu =  !this.showMenu;
    this.auth.changeMessage(this.showMenu);
    const element = document.getElementsByClassName('sidebar_text');

    for (let i = 0; i < element.length; i++) {
      element[i].classList.add('hide');
    }
  }

  ngOnInit() {
    this.supplierId = this.ls.getItem('supplier_id');
    this.subscription = this.searchSer.getsearchShow().subscribe(message => {
      if (message) {
        this.showSearch = message;
        console.log( this.showSearch);
        
      } else {
        // clear messages when empty message received
        this.showSearch = false;
      }
    });

    this.auth.currentMessage.subscribe(message => this.showMenu = message);
  }
  logout() {
    this.supplierId = this.ls.getItem('supplier_id');

    this.auth.logout();
    this.rte.navigate(['/login']);
    localStorage.removeItem('parameters');
    localStorage.removeItem('categoryList');
    localStorage.removeItem('supplierList');
    localStorage.removeItem('selectedProductFilters');
    localStorage.removeItem('selectedSupplierPartnerList');
    localStorage.removeItem('selectedWarehouseList');
    localStorage.removeItem('priceRangesList');
    localStorage.removeItem('selectedPriceRangeList');
    localStorage.removeItem('publishStatus');
    localStorage.removeItem('selectedPriceRangeStart');
    localStorage.removeItem('selectedPriceRangeEnd');
    localStorage.removeItem('filterSelections');
    localStorage.removeItem('warehouseList');
    localStorage.removeItem('types');
    localStorage.removeItem('price_slider_start');
    localStorage.removeItem('price_slider_end');
    localStorage.removeItem('categoryList');
    localStorage.removeItem('attributeList');
  }
  navigate(type) {
    if (type === 'packages') {
      this.rte.navigate(['/admin/packages']);
    } else if (type === 'no-inventory') {
      this.rte.navigate(['/admin/no-inventory']);
    } else if (type === 'settings') {
      this.rte.navigate(['/admin/settings']);
    }
  }


  onChange(event:any){
   this.noInventorySelected =event
  }


  search() {
      this.rte.navigate(['/admin/products/search'], {queryParams: {search:this.noInventorySelected, keywords: this.searchString}});
      this.searchString = '';
  }
}
