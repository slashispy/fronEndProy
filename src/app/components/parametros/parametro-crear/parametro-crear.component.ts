import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Parametro } from '../../../clases/parametro';

import { Router } from '@angular/router';
import { ParametrosService } from '../../../servicios/parametros.service';
import { AlertService } from '../../../servicios/alert.service';

@Component({
  selector: 'app-parametro-crear',
  templateUrl: './parametro-crear.component.html'
})
export class ParametroCrearComponent implements OnInit {
  parametroForm = new FormGroup({
    clave: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  submitted = false;
  parametro: Parametro;

  constructor(private parametrosService: ParametrosService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    if (this.currentUser != null) {
      // something
    } else {
      this.router.navigate(['/login']);
    }
  }

  get f() {return this.parametroForm.controls; }

  nuevoParametro() {
    this.submitted = true;
    if (this.parametroForm.invalid) {
      return;
    }
    const parm = this.parametroForm.value;
    this.parametro = parm;
    if (this.currentUser != null) {
      this.parametrosService.addParameter(parm, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/parametros']);
        },
        errorCode => {
        this.alertService.error(errorCode);
      } );
    }
  }

}
