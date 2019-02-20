import { Component, AfterViewChecked, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { Credenciales } from './clases/credenciales';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked  {
  title = 'Cabisol';
  navBar: boolean;
  currentUser: Credenciales;

  constructor(private router: Router,
    private ref: ChangeDetectorRef) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser != null) {
      this.navBar = true;
    } else {
      this.navBar = false;
    }
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }
}
