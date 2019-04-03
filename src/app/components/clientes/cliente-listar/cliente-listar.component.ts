import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Cliente } from '../../../clases/cliente';

import { Router } from '@angular/router';
import { ClientesService } from '../../../servicios/clientes.service';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/datatables';

@Component({
  selector: 'app-cliente-listar',
  templateUrl: './cliente-listar.component.html'
})
export class ClienteListarComponent extends Datatables implements OnInit, OnDestroy {
  @Output() idCliente = new EventEmitter<string>();
  clientes: Cliente[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private clienteServices: ClientesService,
    private router: Router) {
    super();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.clienteServices.getAllClients(this.currentUser.token)
      .subscribe(
        resp => {
          this.clientes = resp;
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  editClient(id: string) {
    localStorage.removeItem('clienteId');
    localStorage.setItem('clienteId', id);
    this.router.navigate(['cliente-editar']);
  }

}
