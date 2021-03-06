import { Component, OnInit, OnDestroy } from '@angular/core';
import { Datatables } from '../../../clases/utils/datatables';
import { Ajuste } from '../../../clases/ajuste';
import { Credenciales } from '../../../clases/credenciales';
import { Subject } from 'rxjs';
import { AjustesService } from '../../../servicios/ajustes.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../servicios/alert.service';

@Component({
  selector: 'app-ajuste-listar',
  templateUrl: './ajuste-listar.component.html'
})
export class AjusteListarComponent extends Datatables implements OnDestroy, OnInit {

  ajustes: Ajuste[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private ajusteService: AjustesService,
    private router: Router,
    private alertService: AlertService) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.ajusteService.getAjusteByEstado(this.currentUser.token, 'A')
      .subscribe(
        resp => {
          this.ajustes = resp;
          this.dtTrigger.next();
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  editAjuste(id: string): void {
    localStorage.removeItem('ajusteId');
    localStorage.setItem('ajusteId', id);
    this.router.navigate(['ajuste-editar']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
