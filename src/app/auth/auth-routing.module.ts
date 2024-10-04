import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';

const routes: Routes =  [
  {
    path:'',
    children:[
      {path:'login', component: LoginComponent},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class AuthRoutingModule { 
  static getRoutes(): Routes{
    return routes;
  }
}