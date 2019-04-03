import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Cliente } from '../../../clases/cliente';
import { ClientesService } from '../../../servicios/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html'
})
export class ClienteEditarComponent implements OnInit {

  clienteForm = new FormGroup({
    id: new FormControl('', Validators.required),
    ruc: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required)
  });

  currentUser: Credenciales;
  cliente: Cliente;

  constructor(private clienteService: ClientesService,
    private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit() {
    if (this.currentUser != null) {
      const clienteId = localStorage.getItem('clienteId');
      if (!clienteId) {
        alert('Acción Inválida');
        this.router.navigate(['home']);
        return;
      }
      this.clienteService.getClient(this.currentUser.token, clienteId)
      .subscribe(
        resp => {
          this.clienteForm.controls['id'].setValue(resp.id);
          this.clienteForm.controls['ruc'].setValue(resp.ruc);
          this.clienteForm.controls['ruc'].disable();
          this.clienteForm.controls['razonSocial'].setValue(resp.razonSocial);
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

  editarCliente() {
    if (this.clienteForm.invalid) {
      return;
    }
    const clie = this.clienteForm.value;
    this.cliente = clie;
    if (this.currentUser != null) {
      this.clienteService.editClient(clie, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/clientes']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }

}
