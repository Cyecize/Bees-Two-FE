import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './api/auth/auth.interceptor';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(MonacoEditorModule.forRoot()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(MatNativeDateModule),
    importProvidersFrom(BrowserAnimationsModule),
  ],
};
