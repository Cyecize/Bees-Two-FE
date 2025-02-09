import { Component, Injector, OnInit, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from './shared/dialog/dialog.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader/loader.service';
import { NavbarComponent } from './ui/shell/navbar/navbar.component';
import { AuthenticationService } from './api/auth/authentication.service';
import { NgIf } from '@angular/common';
import { UserService } from './api/user/user.service';
import { User } from './api/user/user';
import { RequestTemplateRunningService } from './api/template/request-template-running.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, NavbarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'eu-saas-bees-two-fe';
  user?: User;

  private static injector: Injector;

  constructor(
    private injector: Injector,
    private dialogService: DialogService,
    private loaderService: LoaderService,
    private authService: AuthenticationService,
    private userService: UserService,
    requestTemplateRunningService: RequestTemplateRunningService,
    private viewContainerRef: ViewContainerRef,
  ) {
    AppComponent.injector = injector;
    requestTemplateRunningService.setViewContainerRef(viewContainerRef);
  }

  public static getInjector(): Injector {
    return AppComponent.injector;
  }

  ngOnInit(): void {
    this.authService.init();
    this.userService.currentUser$.subscribe((usr) => (this.user = usr));
  }
}
