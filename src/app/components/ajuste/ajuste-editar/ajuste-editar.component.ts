import { Component, OnInit } from '@angular/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../clases/utils/date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { AjustesService } from '../../../servicios/ajustes.service';
import { AlertService } from '../../../servicios/alert.service';
import { Router } from '@angular/router';
import { TipoAjuste, Ajuste } from '../../../clases/ajuste';

@Component({
  selector: 'app-ajuste-editar',
  templateUrl: './ajuste-editar.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class AjusteEditarComponent implements OnInit {
  ajusteForm = new FormGroup({
    id: new FormControl( '' , Validators.required),
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoAjuste: new FormControl({value: '', disabled: true}, Validators.required),
    detallesAjuste: new FormControl({value: '', disabled: true}, Validators.required)
  });
  currentUser: Credenciales;
  tipoAjuste: TipoAjuste;
  submitted = false;
  ajuste: Ajuste;
  estado = 'C';

  constructor(private ajusteService: AjustesService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      const ajusteId = localStorage.getItem('ajusteId');
      if (!ajusteId) {
        this.router.navigate(['home']);
        return;
      }
      this.ajusteService.getAjuste(this.currentUser.token, ajusteId)
      .subscribe(
        resp => {
          this.estado = resp.estado;
          this.ajusteForm.controls['id'].setValue(resp.id);
          this.ajusteForm.controls['fecha'].setValue(resp.fecha);
          this.ajusteForm.controls['importe'].setValue(resp.importe);
          this.ajusteForm.controls['descuento'].setValue(resp.descuento);
          this.ajusteForm.controls['tipoAjuste'].setValue(resp.tipoAjuste.descripcion);
          this.tipoAjuste = resp.tipoAjuste;
          this.ajusteForm.controls['detallesAjuste'].setValue(resp.detallesAjuste);
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  get f() {return this.ajusteForm.controls; }

  volver() {
    if (this.estado === 'P') {
      this.router.navigate(['/ajustes-pendientes']);
    } else if ( this.estado === 'A') {
      this.router.navigate(['/ajustes']);
    } else {
      this.router.navigate(['/ajustes-canceladas']);
    }
  }

  cancelarAjuste() {
    this.editarAjuste('C');
  }

  editarAjuste(estado: string) {
    this.submitted = true;
    this.ajuste = this.ajusteForm.value;
    this.ajuste.estado = estado;
    if (this.currentUser != null) {
      this.ajusteService.editAjuste(this.ajuste, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/ajustes']);
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    }
  }

}
