import { Component, OnInit } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Router } from '@angular/router';
import { CajaService } from '../../../servicios/caja.service';
import { AlertService } from '../../../servicios/alert.service';
import { Caja } from '../../../clases/caja';
import { Usuario } from '../../../clases/usuario';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../servicios/usuarios.service';

@Component({
  selector: 'app-caja-crear',
  templateUrl: './caja-crear.component.html'
})
export class CajaCrearComponent implements OnInit {
  currentUser: Credenciales;
  cajaForm = new FormGroup({
    fechaApertura: new FormControl({value: '', disabled: true }, Validators.required),
    fechaCierre: new FormControl(''),
    estadoCaja: new FormControl('A'),
    montoApertura: new FormControl('', Validators.required),
    montoCierre: new FormControl(''),
    uso: new FormControl('V', Validators.required),
    usuario: new FormControl({value: '', disabled: true }, Validators.required)
  });
  usuario: Usuario;
  submitted = false;
  caja: Caja;


  constructor(private router: Router,
    private cajaService: CajaService,
    private usuarioService: UsuariosService,
    private alertService: AlertService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.usuario = new Usuario();
    this.usuario.usuario = this.currentUser.usuario;
  }


  ngOnInit() {
    if (this.currentUser != null) {
      this.cajaForm.controls['fechaApertura'].setValue(this.formatDate(new Date()));
      this.usuarioService.getUserByUsuario(this.currentUser.usuario, this.currentUser.token)
      .subscribe(
        resp => {
          this.usuario = resp;
          this.cajaForm.controls['usuario'].setValue(this.usuario);
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  get f() {return this.cajaForm.controls; }

  aperturaCaja() {
    this.submitted = true;
    if (this.cajaForm.invalid) {
      return;
    }
    const caja = this.cajaForm.getRawValue();
    this.caja = caja;
    if (this.currentUser != null) {
      this.cajaService.getCajaAbierta(this.currentUser.token, this.cajaForm.controls['uso'].value , this.currentUser.usuario)
      .subscribe(
        resp => {
          this.alertService.error('Usted ya posee una Caja Abierta con fecha ' + resp.fechaApertura);
        },
        errorCode => {
          this.cajaService.registarCaja(this.currentUser.token, this.caja)
          .subscribe(
          resp => {
            this.router.navigate(['/cajas']);
          },
          errorCode2 => {
            this.alertService.error(errorCode2);
          });
        }
      );
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
