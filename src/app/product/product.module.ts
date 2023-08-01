import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';

import { SearchComponent } from './search/search.component';
import { ItemsComponent } from './items/items.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { SharedModule } from '../shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import{ImageLensComponent} from './image-lens/image-lens.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { ItemsNewComponent } from './items-new/items-new.component';

@NgModule({
  declarations: [
    SearchComponent,
    ItemsComponent,
    ItemDetailsComponent,
    ImageLensComponent,
    ItemsNewComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    CarouselModule,
    NgxSpinnerModule
  ]
})
export class ProductModule { }
