import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { ProductoListarComponent } from './components/productos/producto-listar/producto-listar.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductoCrearComponent } from './components/productos/producto-crear/producto-crear.component';
import { ProductoEditarComponent } from './components/productos/producto-editar/producto-editar.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { ProveedorListarComponent } from './components/proveedores/proveedor-listar/proveedor-listar.component';
import { ProveedorCrearComponent } from './components/proveedores/proveedor-crear/proveedor-crear.component';
import { ProveedorEditarComponent } from './components/proveedores/proveedor-editar/proveedor-editar.component';
import { ClienteListarComponent } from './components/clientes/cliente-listar/cliente-listar.component';
import { ClienteCrearComponent } from './components/clientes/cliente-crear/cliente-crear.component';
import { ClienteEditarComponent } from './components/clientes/cliente-editar/cliente-editar.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'about', component: AboutComponent, canActivate: [AuthGuard]},
    { path: 'productos', component: ProductoListarComponent, canActivate: [AuthGuard]},
    { path: 'producto-crear', component: ProductoCrearComponent, canActivate: [AuthGuard]},
    { path: 'producto-editar', component: ProductoEditarComponent, canActivate: [AuthGuard]},
    { path: 'proveedores', component: ProveedorListarComponent, canActivate: [AuthGuard]},
    { path: 'proveedor-crear', component: ProveedorCrearComponent, canActivate: [AuthGuard]},
    { path: 'proveedor-editar', component: ProveedorEditarComponent, canActivate: [AuthGuard]},
    { path: 'clientes', component: ClienteListarComponent, canActivate: [AuthGuard]},
    { path: 'cliente-crear', component: ClienteCrearComponent, canActivate: [AuthGuard]},
    { path: 'cliente-editar', component: ClienteEditarComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'registrer', component: RegistrarComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'home'}

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
