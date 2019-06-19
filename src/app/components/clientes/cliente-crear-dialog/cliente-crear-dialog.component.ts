import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Cliente } from '../../../clases/cliente';
import { ClientesService } from '../../../servicios/clientes.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cliente-crear-dialog',
  templateUrl: './cliente-crear-dialog.component.html'
})
export class ClienteCrearDialogComponent implements OnInit {

  clienteForm = new FormGroup({
    ruc: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required)
  });

  currentUser: Credenciales;
  submitted = false;
  cliente: Cliente;

  constructor(private clientesService: ClientesService,
    public dialogRef: MatDialogRef<ClienteCrearDialogComponent>,
    private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      // something
    } else {
      this.cerrarDialog();
    }
  }

  get f() {return this.clienteForm.controls; }

  cerrarDialog() {
    this.dialogRef.close();
  }

  nuevoCliente() {
    this.submitted = true;
    if (this.clienteForm.invalid) {
      return;
    }
    const clie = this.clienteForm.value;
    this.cliente = clie;
    if (this.currentUser != null) {
      this.clientesService.addClient(clie, this.currentUser.token)
      .subscribe(
        resp => {
          this.cerrarDialog();
        },
        errorCode => {
          this.alertService.error(errorCode);
          this.cerrarDialog();
      } );
    }
  }

}
