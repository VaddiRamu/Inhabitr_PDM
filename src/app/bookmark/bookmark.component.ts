import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ItemsService } from '../services/items.service';
import { messages } from '../messages/validation_messages';


@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {
  url: string;
  error: string;
  itemInfo: any;
  constructor(private route: ActivatedRoute, private spinner: NgxSpinnerService, private item: ItemsService) { }

  ngOnInit() {
      this.url = this.route.snapshot.queryParamMap.get('url');
      if (this.url !== undefined && this.url !== null) {
        this.scrapeItem(this.url);
      } else {
        this.spinner.hide();
        this.error = messages.ERROR_BOOKMARK;
      }
  }
  scrapeItem(url) {
    this.spinner.show();
    this.item.scrape(url).subscribe(
      resp => {
        this.spinner.hide();
        this.itemInfo = resp;
      }, err => {
        this.spinner.hide();
        this.error = messages.ERROR_BOOKMARK;
      });
  }
  close() {
    window.close();
  }

}
