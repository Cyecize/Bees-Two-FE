import { Component, Injector, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogService } from './shared/dialog/dialog.service';
import { ShowLoader } from './shared/loader/show.loader.decorator';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader/loader.service';
import { firstValueFrom } from 'rxjs';
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

  @ShowLoader()
  async openDialog(): Promise<void> {
    // return new Promise((resolve) => setTimeout(resolve, 1000));
    // return this.dialogService
    //   .openConfirmDialog('Just testing!')
    //   .subscribe((value) => alert(value))

    const res = await firstValueFrom(
      this.dialogService.openConfirmDialog('Test'),
    );
    alert(res);
  }
}
