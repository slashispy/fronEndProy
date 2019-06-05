import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Proveedor } from '../../../clases/proveedor';
import { Router } from '@angular/router';
import { ProveedoresService } from '../../../servicios/proveedores.service';

@Component({
  selector: 'app-proveedor-editar',
  templateUrl: './proveedor-editar.component.html'
})
export class ProveedorEditarComponent implements OnInit {

  proveedorForm = new FormGroup({
    id: new FormControl('', Validators.required),
    razonSocial: new FormControl('', Validators.required),
    ruc: new FormControl('', Validators.required),
    estado: new FormControl('A', Validators.required),
    direccion: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  proveedor: Proveedor;

  constructor(private proveedorService: ProveedoresService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      const proveedorId = localStorage.getItem('proveedorId');
      if (!proveedorId) {
        alert('Acción Inválida');
        this.router.navigate(['home']);
        return;
      }
      this.proveedorService.getProveedor(this.currentUser.token, proveedorId)
      .subscribe(
        resp => {
          this.proveedorForm.controls['id'].setValue(resp.id);
          this.proveedorForm.controls['razonSocial'].setValue(resp.razonSocial);
          this.proveedorForm.controls['ruc'].setValue(resp.ruc);
          this.proveedorForm.controls['ruc'].disable();
          this.proveedorForm.controls['estado'].setValue(resp.estado);
          this.proveedorForm.controls['direccion'].setValue(resp.direccion);
          this.proveedorForm.controls['email'].setValue(resp.email);
          this.proveedorForm.controls['telefono'].setValue(resp.telefono);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  editarProveedor() {
    if (this.proveedorForm.invalid) {
      return;
    }
    const prov = this.proveedorForm.value;
    this.proveedor = prov;
    if (this.currentUser != null) {
      this.proveedorService.editProveedor(prov, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/proveedores']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }

}
