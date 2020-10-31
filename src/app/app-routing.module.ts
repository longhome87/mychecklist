import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards';
import { MemberListComponent } from './members/member-list/member-list.component';
import { FormMemberComponent } from './members/trigger-form/form-member.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomerListComponent },
  { path: 'add', component: CreateCustomerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'members', component: MemberListComponent, canActivate: [AuthGuard] },
  { path: 'checklists', loadChildren: './checklists/checklists.module#ChecklistsModule', canActivate: [AuthGuard] },
  { path: 'members/form-member', component: FormMemberComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
