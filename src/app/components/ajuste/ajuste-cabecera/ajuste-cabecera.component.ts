import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../clases/utils/date-adapter';
import { Credenciales } from '../../../clases/credenciales';
import { Observable } from 'rxjs';
import { Ajuste, DetalleAjuste, TipoAjuste } from '../../../clases/ajuste';
import { Router } from '@angular/router';
import { AjustesService } from '../../../servicios/ajustes.service';
import { AlertService } from '../../../servicios/alert.service';
import { map, startWith } from 'rxjs/operators';
import { AjusteDetalleComponent } from '../ajuste-detalle/ajuste-detalle.component';

@Component({
  selector: 'app-ajuste-cabecera',
  templateUrl: './ajuste-cabecera.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class AjusteCabeceraComponent implements OnInit {
  isValid = true;
  ajusteForm = new FormGroup({
    fecha: new FormControl({value: '', disabled: true}, Validators.required),
    importe: new FormControl({value: '', disabled: true}, Validators.required),
    descuento: new FormControl({value: '', disabled: true}, Validators.required),
    tipoAjuste: new FormControl('', Validators.required),
    detallesAjuste: new FormControl('', Validators.required)
  });
  submitted = false;
  currentUser: Credenciales;
  ajuste: Ajuste;
  detallesAjuste: DetalleAjuste[] = new Array();
  maxDate = new Date();
  typeOptions: TipoAjuste[];
  filteredTypeOptions: Observable<TipoAjuste[]>;

  constructor(private dialog: MatDialog,
    private router: Router,
    private ajusteService: AjustesService,
    private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.ajusteService.ajusteItem = [];
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.ajusteService.getAllTiposAjuste(this.currentUser.token)
      .subscribe(
         resp => {
          this.typeOptions = resp;
          this.filteredTypeOptions = this.ajusteForm.controls.tipoAjuste.valueChanges
                  .pipe(
                    startWith<string | TipoAjuste>(''),
                    map(value => typeof value === 'string' ? value : value.descripcion),
                    map(descripcion => descripcion ? this._filterType(descripcion) : this.typeOptions.slice())
                  );
                  this.ajusteForm.controls['importe'].setValue(0);
                  this.ajusteForm.controls['descuento'].setValue(0);
        } ,
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  AddOrEditAjusteDetalle(orderItemIndex) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex };
    this.dialog.open(AjusteDetalleComponent, dialogConfig).afterClosed().subscribe(res => {
      this.actualizarTotales();
    });
  }

  onDeleteOrderAjusteDetalle(i: number) {
    this.ajusteService.ajusteItem.splice(i, 1);
    this.actualizarTotales();
  }

  private _filterType(name: string): TipoAjuste[] {
    const filterValue = name.toLowerCase();
    return this.typeOptions.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) !== -1);
  }

  actualizarTotales() {
    this.ajusteForm.controls['importe'].setValue( this.ajusteService.ajusteItem.reduce((prev, curr) => {
      return prev + curr.importe;
    }, 0) );
    this.ajusteForm.controls['importe'].setValue(parseFloat(this.ajusteForm.controls['importe'].value));
    this.ajusteForm.controls['descuento'].setValue( this.ajusteService.ajusteItem.reduce((prev, curr) => {
      return prev + curr.descuento;
    }, 0) );
    this.ajusteForm.controls['descuento'].setValue(parseFloat(this.ajusteForm.controls['descuento'].value));

    // agregar para formato
  }

  displayFnType(user?: TipoAjuste): string | undefined {
    return user ? user.descripcion : undefined;
  }

  get f() {return this.ajusteForm.controls; }

  nuevoAjusteInventario() {
    this.submitted = true;
    this.ajusteForm.controls.detallesAjuste.setValue(this.ajusteService.ajusteItem);
    if (this.ajusteForm.invalid) {
      return;
    }
    const ajusteValue = this.ajusteForm.getRawValue();
    this.ajuste = ajusteValue;
    if (this.currentUser != null) {
      this.ajusteService.addAjuste(ajusteValue, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/ajustes']);
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    }
  }

}
