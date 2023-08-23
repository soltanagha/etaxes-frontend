import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NgbModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdminService } from './admin/admin.service';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserRoleService } from './user-role/user-role.service';
import { Role } from 'app/auth/models';

const routes = [
  {
    path: "roles",
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { animation: "AdminComponent" },
    resolve: { users: AdminService }
  },
  {
    path: "add-user-role",
    component: UserRoleComponent,
    canActivate: [AuthGuard],
    data: { animation: "UserRoleComponent"},
  },
  {
    path: "edit-user-role/:id",
    component: UserRoleComponent,
    canActivate: [AuthGuard],
    data: { animation: "UserRoleComponent"},
  }
];


@NgModule({
  declarations: [
    AdminComponent,
    UserRoleComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    HttpClientModule,
    NgbModule,
    CardSnippetModule,
    CoreDirectivesModule,
    CorePipesModule,
    CoreSidebarModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    FormsModule,
    FileUploadModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  providers: [
    AdminService,
    UserRoleService
  ]
})
export class AdminModule { }
