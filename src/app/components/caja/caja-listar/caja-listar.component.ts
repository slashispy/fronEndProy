import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Datatables } from '../../../clases/utils/datatables';
import { Caja } from '../../../clases/caja';
import { Credenciales } from '../../../clases/credenciales';
import { Subject } from 'rxjs';
import { CajaService } from '../../../servicios/caja.service';
import { AlertService } from '../../../servicios/alert.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-caja-listar',
  templateUrl: './caja-listar.component.html'
})
export class CajaListarComponent extends Datatables implements OnInit, OnDestroy {

  cajas: Caja[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private cajaService: CajaService,
    private alertService: AlertService,
    private router: Router) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.cajaService.getAllCajas(this.currentUser.token, this.currentUser.usuario)
      .subscribe(
        resp => {
          this.cajas = resp;
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

  cerrarCaja(id: string ): void {
    localStorage.removeItem('cajaId');
    localStorage.setItem('cajaId', id);
    this.router.navigate(['caja-cerrar']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
