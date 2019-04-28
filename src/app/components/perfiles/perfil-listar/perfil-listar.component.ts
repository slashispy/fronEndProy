import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Perfil } from '../../../clases/perfil';
import { Datatables } from '../../../clases/datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PerfilesService } from '../../../servicios/perfiles.service';

@Component({
  selector: 'app-perfil-listar',
  templateUrl: './perfil-listar.component.html'
})
export class PerfilListarComponent extends Datatables implements OnInit, OnDestroy {
  @Output() idPerfil = new EventEmitter<string>();
  perfiles: Perfil[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private perfilesService: PerfilesService,
    private router: Router) {
    super();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.perfilesService.getAllProfiles(this.currentUser.token)
      .subscribe(
        resp => {
          this.perfiles = resp;
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

  editProfile(id: string): void {
    localStorage.removeItem('perfilId');
    localStorage.setItem('perfilId', id);
    this.router.navigate(['perfil-editar']);
  }

}
