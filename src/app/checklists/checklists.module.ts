import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChecklistListComponent } from './checklist-list/checklist-list.component';
import { CreateChecklistComponent } from './create-checklist/create-checklist.component';
import { ChecklistResolver } from './checklists.resolver';
import { AppMaterialModule } from '../app-material.module';

@NgModule({
  declarations: [
    ChecklistListComponent,
    CreateChecklistComponent
  ],
  imports: [
    RouterModule.forChild([
      { path: '', component: ChecklistListComponent, pathMatch: 'full' },
      {
        path: ':id',
        component: CreateChecklistComponent,
        resolve: { checklist: ChecklistResolver },
        children: [
          { path: 'create', component: CreateChecklistComponent }
        ]
      }
    ]),
    AppMaterialModule
  ],
  providers: [
    ChecklistResolver
  ]
})
export class ChecklistsModule { }
