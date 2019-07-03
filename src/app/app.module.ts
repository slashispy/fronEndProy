import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTablesModule } from 'angular-datatables';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatMenuModule } from '@angular/material/';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputMaskModule } from 'primeng/inputmask';
// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ProductoListarComponent } from './components/productos/producto-listar/producto-listar.component';
import { ProductoEditarComponent } from './components/productos/producto-editar/producto-editar.component';
import { ProductoCrearComponent } from './components/productos/producto-crear/producto-crear.component';
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
import { ParametroCrearComponent } from './components/parametros/parametro-crear/parametro-crear.component';
import { ParametroEditarComponent } from './components/parametros/parametro-editar/parametro-editar.component';
import { PerfilListarComponent } from './components/perfiles/perfil-listar/perfil-listar.component';
import { PerfilCrearComponent } from './components/perfiles/perfil-crear/perfil-crear.component';
import { PerfilEditarComponent } from './components/perfiles/perfil-editar/perfil-editar.component';
import { ComprasComponent } from './components/compras/compra-lista/compras.component';
import { CompraComponent } from './components/compras/compra-cabecera/compra.component';
import { CompraItemsComponent } from './components/compras/compra-detalle/compra-items.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { CambiarPassComponent } from './components/auth/cambiarPass/cambiarPass.component';
import { AjusteListarComponent } from './components/ajuste/ajuste-listar/ajuste-listar.component';
import { AjusteCabeceraComponent } from './components/ajuste/ajuste-cabecera/ajuste-cabecera.component';
import { AjusteDetalleComponent } from './components/ajuste/ajuste-detalle/ajuste-detalle.component';
import { AjusteEditarComponent } from './components/ajuste/ajuste-editar/ajuste-editar.component';
import { ComprasPendientesComponent } from './components/compras/compra-lista-pendientes/compras-pendientes.component';
import { ComprasCanceladasComponent } from './components/compras/compra-lista-canceladas/compras-canceladas.component';
import { ComprasInformeComponent } from './components/compras/compras-informe/compras-informe.component';
import { CompraEditarComponent } from './components/compras/compra-editar/compra-editar.component';
import { AjusteListarCanceladasComponent } from './components/ajuste/ajuste-listar-canceladas/ajuste-listar-canceladas.component';
import { VentaListarComponent } from './components/venta/venta-listar/venta-listar.component';
import { VentaCabeceraComponent } from './components/venta/venta-cabecera/venta-cabecera.component';
import { VentaDetalleComponent } from './components/venta/venta-detalle/venta-detalle.component';
import { VentaDetalleMedioPagoComponent } from './components/venta/venta-detalle-medio-pago/venta-detalle-medio-pago.component';
import { VentasInformeComponent } from './components/venta/ventas-informe/ventas-informe.component';
import { ClienteCrearDialogComponent } from './components/clientes/cliente-crear-dialog/cliente-crear-dialog.component';
import { VentaEditarComponent } from './components/venta/venta-editar/venta-editar.component';
import { VentaListarCanceladasComponent } from './components/venta/venta-listar-canceladas/venta-listar-canceladas.component';
import { StockListarComponent } from './components/stock/stock-listar/stock-listar.component';
import { CajaCrearComponent } from './components/caja/caja-crear/caja-crear.component';
import { CajaEditarComponent } from './components/caja/caja-editar/caja-editar.component';
import { CajaListarComponent } from './components/caja/caja-listar/caja-listar.component';
// Rutas
import { APP_ROUTING } from './app.routes';
// Servicios
import { LoginService } from './servicios/login.service';
import { AlertService } from './servicios/alert.service';
import { ExcelService } from './servicios/excel.service';
// Guards
import { AuthGuard } from './guards/auth.guard';
// Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';

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
    ComprasComponent,
    ComprasPendientesComponent,
    ComprasCanceladasComponent,
    CompraEditarComponent,
    CompraComponent,
    ComprasInformeComponent,
    CompraItemsComponent,
    PermisoListarComponent,
    PermisoCrearComponent,
    PermisoEditarComponent,
    ParametroListarComponent,
    ParametroCrearComponent,
    ParametroEditarComponent,
    PerfilListarComponent,
    PerfilCrearComponent,
    PerfilEditarComponent,
    CambiarPassComponent,
    AlertComponent,
    AjusteListarComponent,
    AjusteCabeceraComponent,
    AjusteDetalleComponent,
    AjusteEditarComponent,
    AjusteListarCanceladasComponent,
    VentaListarComponent,
    VentaCabeceraComponent,
    VentaDetalleComponent,
    VentaDetalleMedioPagoComponent,
    VentasInformeComponent,
    ClienteCrearDialogComponent,
    VentaEditarComponent,
    VentaListarCanceladasComponent,
    StockListarComponent,
    CajaCrearComponent,
    CajaEditarComponent,
    CajaListarComponent
  ],
  entryComponents: [
    CompraItemsComponent,
    AjusteDetalleComponent,
    VentaDetalleComponent,
    VentaDetalleMedioPagoComponent,
    ClienteCrearDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    ReactiveFormsModule,
    APP_ROUTING,
    DataTablesModule,
    DragDropModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFontAwesomeModule,
    MatMenuModule,
    InputMaskModule
  ],
  providers: [
    LoginService,
    AlertService,
    ExcelService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
