import { Component, Injector, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from './shared/dialog/dialog.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader/loader.service';
import { NavbarComponent } from './ui/shell/navbar/navbar.component';
import { AuthenticationService } from './api/auth/authentication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'eu-saas-bees-two-fe';

  private static injector: Injector;

  constructor(
    private injector: Injector,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private authService: AuthenticationService,
  ) {
    AppComponent.injector = injector;
  }

  public static getInjector(): Injector {
    return AppComponent.injector;
  }

  ngOnInit(): void {
    this.authService.init();
  }
}
