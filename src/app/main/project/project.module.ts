import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProjectListComponent } from "./project-list/project-list.component";
import { ProjectListService } from "./project-list/project-list.service";
import { FileUploadModule } from "ng2-file-upload";
import { ProjectEditService } from "./project-edit/project-edit.service";
import { ProjectEditComponent } from "./project-edit/project-edit.component";
import { ProjectService } from "app/shared/project.service";
import { AuthGuard } from "app/auth/helpers";
import { Role } from "app/auth/models";
import { ProjectSubprocessProgressService } from "./project-subprocess/project-subprocess.service";
import { ProjectSubprocessComponent } from "./project-subprocess/project-subprocess.component";
import { FilterProjectSubprocessSidebarComponent } from "./project-subprocess/filter-project-subprocess-sidebar/filter-project-subprocess-sidebar.component";
import { FilterProjectSidebarComponent } from "./filter-project-sidebar/filter-project-sidebar.component";
import { SharedModule } from "app/shared/shared.module";

const routes = [
  {
    path: "add",
    component: ProjectEditComponent,
    canActivate: [AuthGuard],
    data: { animation: "ProjectEditComponent", roles: [Role.User, Role.Admin] },
  },
  {
    path: "list",
    component: ProjectListComponent,
    canActivate: [AuthGuard],
    data: { animation: "ProjectListComponent", roles: [Role.User, Role.Admin] },
  },
  {
    path: "subprocess",
    component: ProjectSubprocessComponent,
    canActivate: [AuthGuard],
    data: {
      animation: "ProjectSubprocessComponent",
      roles: [Role.User, Role.Admin],
    },
  },
  {
    path: "edit/:id",
    component: ProjectEditComponent,
    canActivate: [AuthGuard],
    data: {
      path: "user-view/:id",
      animation: "ProjectEditService",
      roles: [Role.User, Role.Admin],
    },
  },
];

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectEditComponent,
    ProjectSubprocessComponent,
    FilterProjectSubprocessSidebarComponent,
    FilterProjectSidebarComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    FileUploadModule,
    SharedModule,
  ],
  exports: [
    ProjectListComponent,
    ProjectEditComponent,
    ProjectSubprocessComponent,
    FilterProjectSidebarComponent,
  ],
  providers: [
    ProjectService,
    ProjectEditService,
    ProjectListService,
    ProjectSubprocessProgressService,
  ],
})
export class ProjectModule {}
