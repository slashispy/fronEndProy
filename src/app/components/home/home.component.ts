import { Component, OnInit } from '@angular/core';

import { AppComponent } from '../../app.component';
import { Credenciales } from '../../clases/credenciales';
import { Usuario } from '../../clases/usuario';

import { Router } from '@angular/router';

import { LoginService } from '../../servicios/login.service';
import { UsuariosService } from '../../servicios/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  credenciales: Credenciales;
  usuarios: Usuario[];
  user: Usuario;
  saludo: string;

  constructor(private app: AppComponent,
              private loginService: LoginService,
              private usuarioService: UsuariosService,
              private router: Router) { }

  ngOnInit() {
    this.app.obtnerUrl('/home');
    this.credenciales = this.loginService.getCredecianles();
    if (this.credenciales != null) {
      this.usuarioService.getUserByUsuario(this.credenciales.usuario, this.credenciales.token)
      .subscribe(
        resp => {
          this.user = resp;
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
    } else if (hora >= 12 && hora < 20) {
      this.saludo = 'Buenas Tardes';
    } else {
      this.saludo = 'Buenas Noches';
    }
  }

}
