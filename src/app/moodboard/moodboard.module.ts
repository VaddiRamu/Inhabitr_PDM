import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoodboardRoutingModule } from './moodboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MoodboardComponent } from './moodboard-list/moodboard.component';
import { MoodboardDetailsComponent } from './moodboard-details/moodboard-details.component';
import { EditMoodboardTableComponent } from './edit-moodboard-table/edit-moodboard-table.component';


@NgModule({
  declarations: [MoodboardComponent,MoodboardDetailsComponent,EditMoodboardTableComponent],
  imports: [
    CommonModule,
    MoodboardRoutingModule,
    SharedModule
  ]
})
export class MoodboardModule { }
