import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';

import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/clases/utils/date-adapter';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/utils/datatables';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { AlertService } from 'src/app/servicios/alert.service';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../servicios/excel.service';
import { VentasService } from 'src/app/servicios/ventas.service';
import { Venta } from 'src/app/clases/venta';

@Component({
  selector: 'app-ventas-informe',
  templateUrl: './ventas-informe.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class VentasInformeComponent extends Datatables implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  ventas: Venta[];
  maxDate = new Date();
  informeForm = new FormGroup({
    desde: new FormControl({value: this.maxDate, disabled: true}, Validators.required),
    hasta: new FormControl({value: this.maxDate, disabled: true}, Validators.required),
    estado: new FormControl('A', Validators.required)
  });
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private ventasService: VentasService,
    private excelService: ExcelService,
    private router: Router,
    private alerService: AlertService) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    this.dtOptions = {
      searching: false,
      lengthChange: false,
      destroy: true
    };
    if (this.currentUser != null) {
      const desde = this.formatDate(this.maxDate);
      const hasta = desde;
      this.ventasService.informeVentas(this.currentUser.token, desde, hasta, 'A')
      .subscribe(
        resp => {
          // this.ventas = resp;
          this.dtTrigger.next();
        },
        errorCode => {
          this.alerService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  buscar() {
    if (this.currentUser != null) {
      const desde = this.formatDate(this.informeForm.controls.desde.value);
      const hasta = this.formatDate(this.informeForm.controls.hasta.value);
      const estado = this.informeForm.controls.estado.value;
      this.ventasService.informeVentas(this.currentUser.token, desde, hasta, estado)
      .subscribe(
        resp => {
          this.ventas = resp;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        },
        errorCode => {
          this.alerService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private formatDate(date: Date) {
    const d = new Date(date),
    year = d.getFullYear();
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }

  informe() {
    const doc = new jsPDF();
    const cuerpo = new Array();
    if (typeof this.ventas !== 'undefined' && this.ventas.length > 0) {
      this.ventas.forEach(element => {
        cuerpo.push(new Array(element.fecha,
          element.nroFactura,
          element.cliente.razonSocial,
          element.importe.toString(),
          element.descuento.toString(),
          element.tipoVenta.descripcion));
      });
      doc.text('Informe de Ventas', 10, 10);
      doc.setFontSize(8);
      doc.text('Desde: ' + this.formatDate(this.informeForm.controls.desde.value), 10, 15);
      doc.text('Hasta: ' + this.formatDate(this.informeForm.controls.hasta.value), 10, 19);
      switch (this.informeForm.controls.estado.value) {
        case 'A':
          doc.text('Estado: Aprobada', 10, 23);
          break;
        case 'C':
        doc.text('Estado: Cancelada', 10, 23);
          break;
      }
      doc.autoTable({
        margin: {top: 26},
        head: [['Fecha', 'Nro de Factura', 'Cliente', 'Importe', 'Descuento', 'Tipo de Venta']],
        body: cuerpo
      });
      doc.save('informe_ventas.pdf');
    }
  }

  exportAsXLSX(): void {
    const data = new Array();
    if (typeof this.ventas !== 'undefined' && this.ventas.length > 0) {
      this.ventas.forEach(element => {
        data.push({Fecha : element.fecha,
          Nro_factura : element.nroFactura,
          Cliente : element.cliente.razonSocial,
          Importe : element.importe.toString(),
          Descuento : element.descuento.toString(),
          Tipo_de_venta : element.tipoVenta.descripcion});
      });
      this.excelService.exportAsExcelFile(data, 'ventas_desde_' +
      this.formatDate(this.informeForm.controls.desde.value) + '_hasta_' +
      this.formatDate(this.informeForm.controls.hasta.value) + '_estado_' +
      this.informeForm.controls.estado.value);
    }
  }
}
