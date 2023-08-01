import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from '../header/header.component';
import { BookmarkletComponent } from '../bookmarklet/bookmarklet.component';
import { BookmarkComponent } from '../bookmark/bookmark.component';
import { B2BOrderConfigurationComponent } from '../b2-border-configuration/b2-border-configuration.component';
import { NoInventoryComponent } from '../no-inventory/no-inventory.component';
import { AccountSettingsComponent } from '../account-settings/account-settings.component';
import { PackagesComponent } from '../packages/packages.component';
import { PackageDetailsComponent } from '../package-details/package-details.component';
import { ExternalUserComponent } from '../external-user/external-user.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { SupplierDashboardHistoryComponent } from '../supplier-dashboard-history/supplier-dashboard-history.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    BookmarkletComponent,
    BookmarkComponent,
    B2BOrderConfigurationComponent,
    NoInventoryComponent,
    AccountSettingsComponent,
    PackagesComponent,
    PackageDetailsComponent,
    ExternalUserComponent,
    DashboardComponent,
    SupplierDashboardHistoryComponent,
    // NgbdTablePagination
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule
    // NgbdTablePagination
  ],
  // exports:    [ NgMultiSelectDropDownModule ],
  // providers:    [ NgMultiSelectDropDownModule ]
  // bootstrap: [NgbdTablePagination]
})
export class LayoutModule { }
