import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Caja } from '../../../clases/caja';
import { CajaService } from '../../../servicios/caja.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';
import { Usuario } from '../../../clases/usuario';

@Component({
  selector: 'app-caja-editar',
  templateUrl: './caja-editar.component.html'
})
export class CajaEditarComponent implements OnInit {

  cajaForm = new FormGroup({
    id: new FormControl('', Validators.required),
    fechaApertura: new FormControl({value: '', disabled: true }, Validators.required),
    fechaCierre: new FormControl({value: '', disabled: true}, Validators.required),
    estadoCaja: new FormControl('C'),
    montoApertura: new FormControl('', Validators.required),
    montoCierre: new FormControl('', Validators.required),
    uso: new FormControl('V', Validators.required),
    usuario: new FormControl({value: '', disabled: true }, Validators.required)
  });

  currentUser: Credenciales;
  submitted = false;
  caja: Caja;
  usuario: Usuario;

  constructor(private cajaService: CajaService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.usuario = new Usuario();
      this.usuario.usuario = this.currentUser.usuario;
     }

  ngOnInit() {
    if (this.currentUser != null) {
      this.cajaForm.controls['fechaCierre'].setValue(this.formatDate(new Date()));
      const cajaId = localStorage.getItem('cajaId');
      if (!cajaId) {
        alert('Acción Inválida');
        this.router.navigate(['home']);
        return;
      }
      this.cajaService.getCaja(this.currentUser.token, cajaId)
      .subscribe(
        resp => {
          this.cajaForm.controls['id'].setValue(resp.id);
          this.cajaForm.controls['fechaApertura'].setValue(resp.fechaApertura);
          this.cajaForm.controls['montoApertura'].setValue(resp.montoApertura);
          this.cajaForm.controls['montoApertura'].disable();
          this.cajaForm.controls['uso'].setValue(resp.uso);
          this.cajaForm.controls['uso'].disable();
          this.cajaForm.controls['usuario'].setValue(resp.usuario);
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  get f() {return this.cajaForm.controls; }

  cerrarCaja() {
    this.submitted = true;
    if (this.cajaForm.invalid) {
      return;
    }
    const caja = this.cajaForm.getRawValue();
    this.caja = caja;
    if (this.currentUser != null) {
      this.cajaService.cerrarCaja(this.currentUser.token, caja)
      .subscribe(
        resp => {
          this.router.navigate(['/cajas']);
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    }
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
