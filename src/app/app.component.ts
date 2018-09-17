import { Component, AfterViewChecked, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked  {
  title = 'Cabisol';
  href  = '';
  navBar = true;

  constructor(private router: Router,
    private ref: ChangeDetectorRef) {
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  obtnerUrl(urlPara: string) {
    this.href = this.router.url;
    if (urlPara === '/login') {
      this.navBar = false;
    } else {
      this.navBar = true;
    }
  }
}
