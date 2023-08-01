import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../../services/items.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../../services/search.service';


declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  showMenu = false;
  page = 0;
  data = [];
  mySubscription: any;
  search = '';
  showCategory = false;
  sortOptions = false;
  nodatafound = false;
  search_type: any;



  constructor(private auth: AuthenticateService,
              private spinner: NgxSpinnerService,
              private shop: ItemsService,
              private route: Router,
              private actRoute: ActivatedRoute,
              private modalService: NgbModal,
              private searchSer: SearchService
              ) {
                this.actRoute.queryParams.subscribe(params => {
                  if (params.keywords) {
                    this.search = params.keywords;
                    this.search_type = params.search
                    console.log(this.search);
                    console.log(this.search_type);
                    if(this.search){
                      this.data = [];
                      this.getProducts();
                    }
                  }
              });
              }
  ngOnInit() {
    this.getProducts();
    this.searchSer.setHeaserSearch(true);
    $('#waterfall').NewWaterfall({
      width: 200,
      delay: 60,
      repeatShow: false
  });
   // this.auth.currentMessage.subscribe(message => this.showMenu = message);

  }
  ngOnDestroy() {
    this.searchSer.setHeaserSearch(false);
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

getProducts() {
    this.spinner.show();
    //this.data = [{'product_id':'1','product_name':'shifllob bed','product_sku_vartion':{'get_display_image':[{'image_url':{'large':'https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg'}}],'product_sku_vartion':{'asset_value':'55'},'supplier':'jasim'}}];

   this.shop.searchItems(this.search_type,this.page, this.search).subscribe((res: any) => this.onSuccess(res));
  }
  onSuccess(res) {
    $('#waterfall').NewWaterfall({
      width: 200,
      delay: 60,
      repeatShow: false
    });
    console.log(res);
    if (res !== undefined || res.result !== []) {
      this.spinner.hide();
      if (res.message === undefined) {
        res.result.forEach((item: any) => {
          this.data.push(item);
        });
        console.log(this.data);
      } else {
        this.nodatafound = true;
      }
    }
  }

onScroll() {
    this.page = this.page + 50;
    this.getProducts();
  }
}

