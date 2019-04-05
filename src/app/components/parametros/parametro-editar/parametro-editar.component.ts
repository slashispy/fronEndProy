import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Parametro } from '../../../clases/parametro';

import { Router } from '@angular/router';
import { ParametrosService } from '../../../servicios/parametros.service';

@Component({
  selector: 'app-parametro-editar',
  templateUrl: './parametro-editar.component.html'
})
export class ParametroEditarComponent implements OnInit {
  parametroForm = new FormGroup({
    id: new FormControl('', Validators.required),
    clave: new FormControl('', Validators.required),
    valor: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  parametro: Parametro;

  constructor(private parametrosService: ParametrosService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    if (this.currentUser != null) {
      const parametroId = localStorage.getItem('parametroId');
      if (!parametroId) {
        alert('Acción Inválida');
        this.router.navigate(['home']);
        return;
      }
      this.parametrosService.getParameter(this.currentUser.token, parametroId)
      .subscribe(
        resp => {
          this.parametroForm.controls['id'].setValue(resp.id);
          this.parametroForm.controls['clave'].setValue(resp.clave);
          this.parametroForm.controls['clave'].disable();
          this.parametroForm.controls['valor'].setValue(resp.valor);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  editarParametro() {
    if (this.parametroForm.invalid) {
      return;
    }
    const parm = this.parametroForm.value;
    this.parametro = parm;
    if (this.currentUser != null) {
      this.parametrosService.editParameter(parm, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/parametros']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }

}
