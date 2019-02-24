import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { ProductoListarComponent } from './components/productos/producto-listar/producto-listar.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductoCrearComponent } from './components/productos/producto-crear/producto-crear.component';
import { ProductoEditarComponent } from './components/productos/producto-editar/producto-editar.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
    { path: 'productos', component: ProductoListarComponent, canActivate: [AuthGuard] },
    { path: 'producto-crear', component: ProductoCrearComponent, canActivate: [AuthGuard] },
    { path: 'producto-editar', component: ProductoEditarComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'home'}

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
