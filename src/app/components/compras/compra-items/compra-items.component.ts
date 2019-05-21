import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../../../clases/compra';
import { ComprasService } from '../../../servicios/compras.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-compra-items',
  templateUrl: './compra-items.component.html'
})
export class CompraItemsComponent implements OnInit {
  itemList: Item[];
  productoItemForm = new FormGroup({
    producto: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required),
    precioUnitario: new FormControl('', Validators.required),
    descuento: new FormControl('', Validators.required),
    importe: new FormControl('', Validators.required)
  });
  isValid = true;
  ComprasService: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CompraItemsComponent>,
    private comprasService: ComprasService) { }

  ngOnInit() {
    if (this.data.orderItemIndex != null) {
      this.productoItemForm.controls['producto'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['producto']);
      this.productoItemForm.controls['cantidad'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['cantidad']);
      this.productoItemForm.controls['precioUnitario'].setValue(
        this.comprasService.compraItems[this.data.orderItemIndex]['precioUnitario']);
      this.productoItemForm.controls['descuento'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['descuento']);
      this.productoItemForm.controls['importe'].setValue(this.comprasService.compraItems[this.data.orderItemIndex]['importe']);
    }
  }

  /*updatePrice(ctrl) {
    if (ctrl.selectedIndex === 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    } else {
      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].Name;
    }
    this.updateTotal();
  }*/

  updateTotal() {
    this.productoItemForm.controls['importe'].setValue(
        this.productoItemForm.controls['precioUnitario'].value * this.productoItemForm.controls['cantidad'].value
        - this.productoItemForm.controls['descuento'].value
    );
  }

  onSubmit(form: NgForm) {
    if (this.productoItemForm.invalid) {
      return;
    }
    if (this.data.orderItemIndex != null) {
      this.comprasService.compraItems[this.data.orderItemIndex] = this.productoItemForm.value;
    } else {
      this.comprasService.compraItems.push(this.productoItemForm.value);
    }
    this.dialogRef.close();
  }

  validateForm(formData: Item) {
    this.isValid = true;
    /*if (formData.ItemID === 0) {
      this.isValid = false;
    } else if (formData.Quantity === 0) {
      this.isValid = false;
    }*/
    return this.isValid;
  }

}
