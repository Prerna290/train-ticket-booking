import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    //when we will click on search, new component will be rendered, so to fetch data we need parametrized routes
    path: 'search/:fromStationId/:toStationId/:dateOfTravel',
    component: SearchComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
];
