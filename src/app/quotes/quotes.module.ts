import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesRoutingModule } from './quotes-routing.module';
import { MyquoteComponent } from './myquote/myquote.component';
import { EditQuoteComponent } from './edit-quote/edit-quote.component';
import { CreateQuoteComponent } from './create-quote/create-quote.component';
import { SharedModule } from '../shared/shared.module';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';


@NgModule({
  declarations: [MyquoteComponent,EditQuoteComponent,CreateQuoteComponent, DialogBoxComponent],
  imports: [
    CommonModule,
    QuotesRoutingModule,
    SharedModule
  ],
  entryComponents: [ DialogBoxComponent ]
})
export class QuotesModule { }
