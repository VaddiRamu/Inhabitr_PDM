import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuoteComponent } from "./create-quote/create-quote.component";
import { EditQuoteComponent } from "./edit-quote/edit-quote.component";
import { MyquoteComponent } from "./myquote/myquote.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  {
    path: "view/:id",
    component: EditQuoteComponent,
  },
  {
    path: "list/:type",
    component: MyquoteComponent,
  },
  {
    path: "create",
    component: CreateQuoteComponent,
  },
  {
    path: "order/:id",
    component: EditQuoteComponent,
  },

  {
    path: 'orders/:type',
    component: MyquoteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotesRoutingModule {}
