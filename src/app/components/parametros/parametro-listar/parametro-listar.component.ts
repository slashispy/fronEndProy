import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Parametro } from '../../../clases/parametro';

import { Router } from '@angular/router';
import { ParametrosService } from '../../../servicios/parametros.service';

import { Subject } from 'rxjs';
import { Datatables } from '../../../clases/utils/datatables';

@Component({
  selector: 'app-parametro-listar',
  templateUrl: './parametro-listar.component.html'
})
export class ParametroListarComponent extends Datatables implements OnInit, OnDestroy {
  @Output() idParametro = new EventEmitter<string>();
  parametros: Parametro[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private parametrosService: ParametrosService,
    private router: Router) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.parametrosService.getAllParameters(this.currentUser.token)
      .subscribe(
        resp => {
          this.parametros = resp;
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

  editParameter(id: string): void {
    localStorage.removeItem('parametroId');
    localStorage.setItem('parametroId', id);
    this.router.navigate(['parametro-editar']);
  }

}
