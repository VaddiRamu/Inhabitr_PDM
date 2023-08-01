import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { RoombuilderComponent } from './roombuilder/roombuilder.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  {
    path: "list",
    component:ProjectListComponent
  },
  {
    path: "create",
    component:CreateProjectsComponent
  },
  {
    path: "roombuilder",
    component:RoombuilderComponent
  },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
