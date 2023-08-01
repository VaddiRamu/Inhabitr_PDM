
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../services/items.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-bookmarklet',
  templateUrl: './bookmarklet.component.html',
  styleUrls: ['./bookmarklet.component.css']
})
export class BookmarkletComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:max-line-length
  bookmarkletURL = this.sanitizer.bypassSecurityTrustUrl(`javascript:(function(){var url = document.location.href;window.open('${window.location.origin}/scrape?url='+url,'_blank','resizable=yes,location=0,top=100,left=350,width=750,height=500');})();`);

  showMenu = false;
  mySubscription: any;
  constructor(private auth: AuthenticateService,
              private spinner: NgxSpinnerService,
              private shop: ItemsService,
              private route: Router,
              private sanitizer: DomSanitizer) {
                // tslint:disable-next-line: only-arrow-functions
                this.route.routeReuseStrategy.shouldReuseRoute = function() {
                  return false;
                };
                this.mySubscription = this.route.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    // Trick the Route into believing it's last link wasn't previously loaded
                    this.route.navigated = false;
                  }
                }); }
  ngOnInit() {
    this.auth.currentMessage.subscribe(message => this.showMenu = message);
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
