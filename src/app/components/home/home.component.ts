import { Component, OnInit } from '@angular/core';
import { Credenciales } from '../../clases/credenciales';
import { Usuario } from '../../clases/usuario';

import { Router } from '@angular/router';

import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  currentUser: Credenciales;
  usuarios: Usuario[];
  user: Usuario;
  saludo: string;

  constructor(private usuarioService: UsuariosService,
              private router: Router) {
                this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
              }

  ngOnInit() {
    if (this.currentUser != null) {
      this.usuarioService.getUserByUsuario(this.currentUser.usuario, this.currentUser.token)
      .subscribe(
        resp => {
          this.user =  resp;
        },
        errorCode => {
          console.log(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
    this.saludoF();
  }

  saludoF() {
    const d = new Date();
    const hora: number = d.getHours();
    if (hora >= 6 && hora < 12) {
      this.saludo = 'Buenos Días';
    } else if (hora >= 12 && hora < 19) {
      this.saludo = 'Buenas Tardes';
    } else {
      this.saludo = 'Buenas Noches';
    }
  }

}
