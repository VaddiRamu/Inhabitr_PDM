import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './public-pages/login/login.component';
import { SignupComponent } from './public-pages/signup/signup.component';
import { ForgotPasswordComponent } from './public-pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './public-pages/reset-password/reset-password.component';
import { SupplierDashboardHistoryComponent } from './supplier-dashboard-history/supplier-dashboard-history.component';
import { ImageLensComponent } from './product/image-lens/image-lens.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full',
  },
  // public routes
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'forgot/password',
    component: ForgotPasswordComponent
  },
  {
    path: 'password/forgot/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'admin/supplierHistory',
    component:SupplierDashboardHistoryComponent
  },
  
  
  // private routes
 // moodboard
  // {
  //   path: 'moodboard-details/:id',
  //   component: MoodboardDetailsComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'moodboards/:type',
  //   component: MoodboardComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'create/moodboard',
  //   component: CreateMoodboardComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'edit/moodboard',
  //   component: EditMoodboardTableComponent,
  //   canActivate: [AuthGuard]
  // },
 

  // quotes
  // {
  //   path: 'quote/:id',
  //   component: EditQuoteComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'quotes/:type',
  //   component: MyquoteComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'create/quote',
  //   component: CreateQuoteComponent,
  //   canActivate: [AuthGuard]
  // }, 

  // orders
  // {
  //   path: 'order/:id',
  //   component: EditQuoteComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'orders/:type',
  //   component: MyquoteComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'search',
  //   component: SearchComponent,
  //   // canActivate: [AuthGuard]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
