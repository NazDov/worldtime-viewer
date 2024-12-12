import { Routes } from '@angular/router';
import {ClocksDashboardComponent} from "./clocks-dashboard/clocks-dashboard.component";

export const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: ClocksDashboardComponent},
];
