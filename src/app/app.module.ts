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
import { DataTablesModule } from 'angular-datatables';
// Rutas
import { APP_ROUTING } from './app.routes';
// Servicios
import { LoginService } from './servicios/login.service';
import { ProductoListarComponent } from './components/productos/producto-listar/producto-listar.component';
import { ProductoEditarComponent } from './components/productos/producto-editar/producto-editar.component';
// Guards
import { AuthGuard } from './guards/auth.guard';
// Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { ProductoCrearComponent } from './components/productos/producto-crear/producto-crear.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { ProveedorListarComponent } from './components/proveedores/proveedor-listar/proveedor-listar.component';
import { ProveedorCrearComponent } from './components/proveedores/proveedor-crear/proveedor-crear.component';
import { ProveedorEditarComponent } from './components/proveedores/proveedor-editar/proveedor-editar.component';

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
    ProveedorEditarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    APP_ROUTING,
    DataTablesModule
  ],
  providers: [
    LoginService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
