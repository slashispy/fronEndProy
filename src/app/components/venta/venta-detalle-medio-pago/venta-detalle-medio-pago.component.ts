import { Component, OnInit, Inject } from '@angular/core';
import { VentaDetalleMedioPago, MedioPago } from '../../../clases/venta';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Observable } from 'rxjs';
import { VentasService } from '../../../servicios/ventas.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/servicios/alert.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-venta-detalle-medio-pago',
  templateUrl: './venta-detalle-medio-pago.component.html'
})
export class VentaDetalleMedioPagoComponent implements OnInit {
  itemList: VentaDetalleMedioPago[];
  DetalleVentaMedioPagoForm = new FormGroup({
    medioPago: new FormControl('', Validators.required),
    monto: new FormControl('', Validators.required),
    vuelto: new FormControl({ value: '' , disabled: true }, Validators.required)
  });
  isValid = true;
  currentUser: Credenciales;
  options: MedioPago[];
  filteredOptions: Observable<MedioPago[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<VentaDetalleMedioPagoComponent>,
    private ventasService: VentasService,
    private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.ventasService.getAllMedioPagos(this.currentUser.token)
      .subscribe(
        resp => {
          this.options = resp;
          this.filteredOptions = this.DetalleVentaMedioPagoForm.controls.medioPago.valueChanges
            .pipe(
              startWith<string | MedioPago>(''),
              map(value => typeof value === 'string' ? value : value.descripcion),
              map(descripcion => descripcion ? this._filter(descripcion) : this.options.slice())
            );
          if (this.data.orderItemIndex != null) {
            this.DetalleVentaMedioPagoForm.controls['medioPago']
            .setValue(this.ventasService.ventasMediosPago[this.data.orderItemIndex]['medioPago']);
            this.DetalleVentaMedioPagoForm.controls['monto']
            .setValue(this.ventasService.ventasMediosPago[this.data.orderItemIndex]['monto']);
            this.DetalleVentaMedioPagoForm.controls['vuelto']
            .setValue(this.ventasService.ventasMediosPago[this.data.orderItemIndex]['vuelto']);
          } else {
            this.DetalleVentaMedioPagoForm.controls['monto'].setValue(0);
            this.DetalleVentaMedioPagoForm.controls['vuelto'].setValue(0);
          }
        },
        errorCode => {
            this.alertService.error(errorCode);
        }
      );
    } else {
      this.dialogRef.close();
    }
  }

  displayFn(user?: MedioPago): string | undefined {
    return user ? user.descripcion : undefined;
  }

  validateForm() {
    this.isValid = true;
    if (!this.options.includes(this.DetalleVentaMedioPagoForm.controls['medioPago'].value)) {
      const medioPago: MedioPago = this.DetalleVentaMedioPagoForm.controls['medioPago'].value;
      for (let  x = 0; x < this.options.length; x++) {
        if (this.options[x].id === medioPago.id) {
          this.isValid = true;
          break;
        } else {
          this.isValid = false;
        }
      }
    }
    return this.isValid;
  }

  updateTotal() {
    this.DetalleVentaMedioPagoForm.controls['vuelto'].setValue(
        this.DetalleVentaMedioPagoForm.controls['monto'].value - this.data.importe
    );
  }

  onSubmit(form: NgForm) {
    if (this.DetalleVentaMedioPagoForm.invalid || !this.validateForm()) {
      return;
    }
    if (this.data.orderItemIndex != null) {
      this.ventasService.ventasMediosPago[this.data.orderItemIndex] = this.DetalleVentaMedioPagoForm.getRawValue();
    } else {
      this.ventasService.ventasMediosPago.push(this.DetalleVentaMedioPagoForm.getRawValue());
    }
    this.dialogRef.close();
  }

  private _filter(name: string): MedioPago[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) !== -1);
  }

}
