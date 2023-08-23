import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ProjectModule } from 'app/main/project/project.module';
import { AuthGuard, ErrorInterceptor, fakeBackendProvider, JwtInterceptor } from './auth/helpers';
import { ReportModule } from './main/report/report.module';
import { Role } from './auth/models';
import { SharedModule } from './shared/shared.module';

const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'project',
    loadChildren: () => import('./main/project/project.module').then(m => m.ProjectModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'report',
    loadChildren: () => import('./main/report/report.module').then(m => m.ReportModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./main/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/project/list',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    TranslateModule.forRoot(),

    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot(),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,

    // App modules
    LayoutModule,
    ProjectModule,
    ReportModule,
    SharedModule
  ],
  providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,
	],
  bootstrap: [AppComponent]
})
export class AppModule {}
