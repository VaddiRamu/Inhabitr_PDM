import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ItemsComponent } from "./items/items.component";
import { ItemDetailsComponent } from "./item-details/item-details.component";
import { SearchComponent } from "./search/search.component";
import { ImageLensComponent } from "./image-lens/image-lens.component";
import { ItemsNewComponent } from "./items-new/items-new.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  {
    path: "list",
    component:ItemsComponent
  },
  // {
  //   path: "list",
  //   component:ItemsNewComponent
  // },
  {
    path: "view/:id",
    component:ItemDetailsComponent
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'imageLens',
    component:ImageLensComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
