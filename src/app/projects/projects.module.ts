import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import { SharedModule } from '../shared/shared.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { DialogboxComponent } from './dialogbox/dialogbox.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { RoombuilderComponent } from './roombuilder/roombuilder.component';

@NgModule({
  declarations: [
    CreateProjectsComponent,
    ProjectListComponent,
    DialogboxComponent,
    CalculatorComponent,
    RoombuilderComponent
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    SharedModule
  ],
  entryComponents: [ DialogboxComponent ]
})
export class ProjectsModule { }
