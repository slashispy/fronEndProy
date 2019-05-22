import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ProductoListarComponent } from './components/productos/producto-listar/producto-listar.component';
import { ProductoEditarComponent } from './components/productos/producto-editar/producto-editar.component';
import { ProductoCrearComponent } from './components/productos/producto-crear/producto-crear.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
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
import { ParametroCrearComponent } from './components/parametros/parametro-crear/parametro-crear.component';
import { ParametroEditarComponent } from './components/parametros/parametro-editar/parametro-editar.component';
import { PerfilListarComponent } from './components/perfiles/perfil-listar/perfil-listar.component';
import { PerfilCrearComponent } from './components/perfiles/perfil-crear/perfil-crear.component';
import { PerfilEditarComponent } from './components/perfiles/perfil-editar/perfil-editar.component';
// Rutas
import { APP_ROUTING } from './app.routes';
// Servicios
import { LoginService } from './servicios/login.service';
// Guards
import { AuthGuard } from './guards/auth.guard';
// Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';
// Modulos
import { DataTablesModule } from 'angular-datatables';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent,
    HomeComponent,
    NavbarComponent,
    ProductoListarComponent,
    ProductoEditarComponent,
    ProductoCrearComponent,
    RegistrarComponent,
    ProveedorListarComponent,
    ProveedorCrearComponent,
    ProveedorEditarComponent,
    ClienteListarComponent,
    ClienteCrearComponent,
    ClienteEditarComponent,
    PermisoListarComponent,
    PermisoCrearComponent,
    PermisoEditarComponent,
    ParametroListarComponent,
    ParametroCrearComponent,
    ParametroEditarComponent,
    PerfilListarComponent,
    PerfilCrearComponent,
    PerfilEditarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    APP_ROUTING,
    DataTablesModule,
    DragDropModule
  ],
  providers: [
    LoginService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
