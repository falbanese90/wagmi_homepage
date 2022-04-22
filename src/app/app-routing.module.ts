import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StakeComponent } from './stake/stake.component';
import { RoadMapComponent } from './road-map/road-map.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'stake', component: StakeComponent },
  { path: 'road_map', component: RoadMapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
