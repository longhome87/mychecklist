import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CreateCustomerComponent } from './customers/create-customer/create-customer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './_guards';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ChecklistListComponent } from './checklists/checklist-list/checklist-list.component';
import { CreateChecklistComponent } from './checklists/create-checklist/create-checklist.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomerListComponent },
  { path: 'add', component: CreateCustomerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'members', component: MemberListComponent },
  { path: 'checklists', loadChildren: './checklists/checklists.module#ChecklistsModule' },
  // { path: 'checklists/create', component: CreateChecklistComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
