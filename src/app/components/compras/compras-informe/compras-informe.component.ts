import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Prod, Compra } from '../../../clases/compra';

import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/clases/utils/date-adapter';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/utils/datatables';
import { ComprasService } from 'src/app/servicios/compras.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-compras-informe',
  templateUrl: './compras-informe.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class ComprasInformeComponent extends Datatables implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  compras: Compra[];
  maxDate = new Date();
  informeForm = new FormGroup({
    desde: new FormControl({value: this.maxDate, disabled: true}, Validators.required),
    hasta: new FormControl({value: this.maxDate, disabled: true}, Validators.required),
    estado: new FormControl('P', Validators.required)
  });
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private comprasService: ComprasService,
    private router: Router) {
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
      this.comprasService.informeCompras(this.currentUser.token, desde, hasta, 'P')
      .subscribe(
        resp => {
          // this.compras = resp;
          this.dtTrigger.next();
        },
        errorCode => {
          console.log(errorCode);
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
      this.comprasService.informeCompras(this.currentUser.token, desde, hasta, estado)
      .subscribe(
        resp => {
          this.compras = resp;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        },
        errorCode => {
          console.log(errorCode);
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
}
