import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateMoodboardComponent } from "../shared/create-moodboard/create-moodboard.component";
import { MoodboardDetailsComponent } from "./moodboard-details/moodboard-details.component";
import { MoodboardComponent } from "./moodboard-list/moodboard.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "list",
  },
  { path: "list/:type", component: MoodboardComponent },
  { path: "view/:id", component: MoodboardDetailsComponent },
  { path: "create", component: CreateMoodboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoodboardRoutingModule {}
