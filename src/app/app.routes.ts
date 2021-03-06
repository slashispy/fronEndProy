import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ProductoListarComponent } from './components/productos/producto-listar/producto-listar.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductoCrearComponent } from './components/productos/producto-crear/producto-crear.component';
import { ProductoEditarComponent } from './components/productos/producto-editar/producto-editar.component';
import { RegistrarComponent } from './components/auth/registrar/registrar.component';
import { ProveedorListarComponent } from './components/proveedores/proveedor-listar/proveedor-listar.component';
import { ProveedorCrearComponent } from './components/proveedores/proveedor-crear/proveedor-crear.component';
import { ProveedorEditarComponent } from './components/proveedores/proveedor-editar/proveedor-editar.component';
import { ClienteListarComponent } from './components/clientes/cliente-listar/cliente-listar.component';
import { ClienteCrearComponent } from './components/clientes/cliente-crear/cliente-crear.component';
import { ClienteEditarComponent } from './components/clientes/cliente-editar/cliente-editar.component';
import { PermisoListarComponent } from './components/permisos/permiso-listar/permiso-listar.component';
import { PermisoCrearComponent } from './components/permisos/permiso-crear/permiso-crear.component';
import { PermisoEditarComponent } from './components/permisos/permiso-editar/permiso-editar.component';
import { ParametroListarComponent } from './components/parametros/parametro-listar/parametro-listar.component';
import { ParametroEditarComponent } from './components/parametros/parametro-editar/parametro-editar.component';
import { ParametroCrearComponent } from './components/parametros/parametro-crear/parametro-crear.component';
import { PerfilListarComponent } from './components/perfiles/perfil-listar/perfil-listar.component';
import { PerfilCrearComponent } from './components/perfiles/perfil-crear/perfil-crear.component';
import { PerfilEditarComponent } from './components/perfiles/perfil-editar/perfil-editar.component';
import { ComprasComponent } from './components/compras/compra-lista/compras.component';
import { CompraComponent } from './components/compras/compra-cabecera/compra.component';
import { CambiarPassComponent } from './components/auth/cambiarPass/cambiarPass.component';
import { ComprasPendientesComponent } from './components/compras/compra-lista-pendientes/compras-pendientes.component';
import { ComprasCanceladasComponent } from './components/compras/compra-lista-canceladas/compras-canceladas.component';
import { ComprasInformeComponent } from './components/compras/compras-informe/compras-informe.component';
import { CompraEditarComponent } from './components/compras/compra-editar/compra-editar.component';
import { AjusteListarComponent } from './components/ajuste/ajuste-listar/ajuste-listar.component';
import { AjusteCabeceraComponent } from './components/ajuste/ajuste-cabecera/ajuste-cabecera.component';
import { AjusteEditarComponent } from './components/ajuste/ajuste-editar/ajuste-editar.component';
import { AjusteListarCanceladasComponent } from './components/ajuste/ajuste-listar-canceladas/ajuste-listar-canceladas.component';
import { VentaListarComponent } from './components/venta/venta-listar/venta-listar.component';
import { VentaCabeceraComponent } from './components/venta/venta-cabecera/venta-cabecera.component';
import { VentaEditarComponent } from './components/venta/venta-editar/venta-editar.component';
import { VentaListarCanceladasComponent } from './components/venta/venta-listar-canceladas/venta-listar-canceladas.component';
import { VentasInformeComponent } from './components/venta/ventas-informe/ventas-informe.component';
import { StockListarComponent } from './components/stock/stock-listar/stock-listar.component';
import { CajaCrearComponent } from './components/caja/caja-crear/caja-crear.component';
import { CajaListarComponent } from './components/caja/caja-listar/caja-listar.component';
import { CajaEditarComponent } from './components/caja/caja-editar/caja-editar.component';

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
    { path: 'compras', component: ComprasComponent, canActivate: [AuthGuard]},
    { path: 'compras-pendientes', component: ComprasPendientesComponent, canActivate: [AuthGuard]},
    { path: 'compras-canceladas', component: ComprasCanceladasComponent, canActivate: [AuthGuard]},
    { path: 'compra-editar', component: CompraEditarComponent, canActivate: [AuthGuard]},
    { path: 'compra-crear', component: CompraComponent, canActivate: [AuthGuard]},
    { path: 'compras-informe', component: ComprasInformeComponent, canActivate: [AuthGuard]},
    { path: 'ajustes', component: AjusteListarComponent, canActivate: [AuthGuard]},
    { path: 'ajuste-crear', component: AjusteCabeceraComponent, canActivate: [AuthGuard]},
    { path: 'ajuste-editar', component: AjusteEditarComponent, canActivate: [AuthGuard]},
    { path: 'ajustes-canceladas', component: AjusteListarCanceladasComponent, canActivate: [AuthGuard]},
    { path: 'cajas', component: CajaListarComponent, canActivate: [AuthGuard]},
    { path: 'caja-crear', component: CajaCrearComponent, canActivate: [AuthGuard]},
    { path: 'caja-cerrar', component: CajaEditarComponent, canActivate: [AuthGuard]},
    { path: 'ventas', component: VentaListarComponent, canActivate: [AuthGuard]},
    { path: 'venta-crear', component: VentaCabeceraComponent, canActivate: [AuthGuard]},
    { path: 'venta-editar', component: VentaEditarComponent, canActivate: [AuthGuard]},
    { path: 'ventas-canceladas', component: VentaListarCanceladasComponent, canActivate: [AuthGuard]},
    { path: 'ventas-informe', component: VentasInformeComponent, canActivate: [AuthGuard]},
    { path: 'stock', component: StockListarComponent, canActivate: [AuthGuard]},
    { path: 'permisos', component: PermisoListarComponent, canActivate: [AuthGuard]},
    { path: 'permiso-crear', component: PermisoCrearComponent, canActivate: [AuthGuard]},
    { path: 'permiso-editar', component: PermisoEditarComponent, canActivate: [AuthGuard]},
    { path: 'parametros', component: ParametroListarComponent, canActivate: [AuthGuard]},
    { path: 'parametro-crear', component: ParametroCrearComponent, canActivate: [AuthGuard]},
    { path: 'parametro-editar', component: ParametroEditarComponent, canActivate: [AuthGuard]},
    { path: 'perfiles', component: PerfilListarComponent, canActivate: [AuthGuard]},
    { path: 'perfil-crear', component: PerfilCrearComponent, canActivate: [AuthGuard]},
    { path: 'perfil-editar', component: PerfilEditarComponent, canActivate: [AuthGuard]},
    { path: 'cambiarPass', component: CambiarPassComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'registrer', component: RegistrarComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'home'}

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
