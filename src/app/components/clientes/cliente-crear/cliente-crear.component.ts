import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Cliente } from '../../../clases/cliente';
import { ClientesService } from '../../../servicios/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-crear',
  templateUrl: './cliente-crear.component.html'
})
export class ClienteCrearComponent implements OnInit {

  clienteForm = new FormGroup({
    ruc: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required)
  });

  currentUser: Credenciales;
  cliente: Cliente;

  constructor(private clientesService: ClientesService,
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

  nuevoCliente() {
    if (this.clienteForm.invalid) {
      return;
    }
    const clie = this.clienteForm.value;
    this.cliente = clie;
    if (this.currentUser != null) {
      this.clientesService.addClient(clie, this.currentUser.token)
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
