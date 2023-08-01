import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModalFormComponent } from "./modal-form/modal-form.component";
import { Ng5SliderModule } from "ng5-slider";
import { ToastrModule } from "ngx-toastr";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CreateMoodboardComponent } from "./create-moodboard/create-moodboard.component";
import { OrderByPipe } from "../pipes/order-by.pipe";
import { AdvanceSearchComponent } from "./advance-search/advance-search.component";
import { ConfirmationboxComponent } from "./confirmationbox/confirmationbox.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
@NgModule({
  declarations: [
    ModalFormComponent,
    CreateMoodboardComponent,
    OrderByPipe,
    AdvanceSearchComponent,
    ConfirmationboxComponent
  ],
  imports: [
    CommonModule,
    Ng5SliderModule,
    ToastrModule,
    InfiniteScrollModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgMultiSelectDropDownModule
  ],
  exports: [
    ModalFormComponent,
    CreateMoodboardComponent,
    FormsModule,
    Ng5SliderModule,
    ToastrModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    NgSelectModule,
    OrderByPipe,
    AdvanceSearchComponent,
    NgbModule,
    ConfirmationboxComponent,
    NgMultiSelectDropDownModule
  ],
})
export class SharedModule {}
