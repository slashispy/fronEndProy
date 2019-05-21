import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Compra, Item } from '../../../clases/compra';
import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';
import { ComprasService } from '../../../servicios/compras.service';


import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CompraItemsComponent } from '../compra-items/compra-items.component';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
})
export class CompraComponent implements OnInit {
  isValid = true;
  productoForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    estado: new FormControl('A', Validators.required),
    controlarStock: new FormControl('S', Validators.required),
    precioUnitario: new FormControl('', Validators.required),
    cantidadMinima: new FormControl('', Validators.required),
    gtotal: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  producto: Compra;
  compraItems: Item[] = new Array();

  constructor(private productosService: ProductosService,
    private dialog: MatDialog,
    private router: Router,
    private comprasService: ComprasService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      // something
    } else {
      this.router.navigate(['/login']);
    }
  }

  nuevoProducto() {
    if (this.productoForm.invalid) {
      return;
    }
    const prod = this.productoForm.value;
    this.producto = prod;
    if (this.currentUser != null) {
      this.productosService.addProduct(prod, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/productos']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }

  resetForm(form?: NgForm) {
    if (form = null) {
      form.resetForm();
    }
    /*this.service.formData = {
      OrderID: null,
      CustomerID: 0,
      PMethod: '',
      gtotal: 0,
      DeletedOrderItemIDs: ''
    };
    this.service.orderItems = [];*/
  }

  AddOrEditOrderItem(orderItemIndex) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    dialogConfig.data = { orderItemIndex };
    this.dialog.open(CompraItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });
  }


  onDeleteOrderItem(i: number) {
    this.comprasService.compraItems.splice(i, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal() {
    /*this.service.formData.gtotal = this.service.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
    this.service.formData.gtotal = parseFloat(this.service.formData.gtotal.toFixed(2));*/
  }
}
