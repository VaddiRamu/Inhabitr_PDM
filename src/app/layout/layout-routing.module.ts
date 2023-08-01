import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountSettingsComponent } from "../account-settings/account-settings.component";
import { B2BOrderConfigurationComponent } from "../b2-border-configuration/b2-border-configuration.component";
import { BookmarkComponent } from "../bookmark/bookmark.component";
import { BookmarkletComponent } from "../bookmarklet/bookmarklet.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { ExternalUserComponent } from "../external-user/external-user.component";
import { NoInventoryComponent } from "../no-inventory/no-inventory.component";
import { PackageDetailsComponent } from "../package-details/package-details.component";
import { PackagesComponent } from "../packages/packages.component";
import { AuthGuard } from "../services/auth.guard";
import { LayoutComponent } from "./layout.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "products",
        loadChildren: () =>
          import("../product/product.module").then((m) => m.ProductModule),
        canActivate: [AuthGuard],
      },
      {
        path: "moodboard",
        loadChildren: () =>
          import("../moodboard/moodboard.module").then((m) => m.MoodboardModule),
          canActivate: [AuthGuard],
      },
      {
        path: "quote",
        loadChildren: () =>
          import("../quotes/quotes.module").then((m) => m.QuotesModule),
          canActivate: [AuthGuard],
      },
      {
        path: "projects",
        loadChildren: () =>
          import("../projects/projects.module").then((m) => m.ProjectsModule),
          canActivate: [AuthGuard],
      },
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboard",
      },


      {
        path: 'bookmarklet',
        component: BookmarkletComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'scrape',
        component: BookmarkComponent
      },
      {
        path: 'B2Borderconfig',
        component: B2BOrderConfigurationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'no-inventory',
        component: NoInventoryComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: AccountSettingsComponent,
        canActivate: [AuthGuard]
      },
      // un used routes
      {
        path: 'packages',
        component: PackagesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'packagedetails/:id',
        component: PackageDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: ExternalUserComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
