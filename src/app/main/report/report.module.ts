import { NgModule } from '@angular/core';
import { ProjectsReportComponent } from './projects-report/projects-report.component';
import { AuthGuard } from 'app/auth/helpers';
import { RouterModule } from '@angular/router';
import { ProjectReportService } from './projects-report/project-report.service';
import { FilterProjectReportSidebarComponent } from './projects-report/filter-project-report-sidebar/filter-project-report-sidebar.component';
import { SubprocessProgressComponent } from './subprocess-progress/subprocess-progress.component';
import { SharedModule } from 'app/shared/shared.module';


const routes = [
  {
    path: "project-report",
    component: ProjectsReportComponent,
    canActivate: [AuthGuard],
    data: { animation: "ProjectsReportComponent" },
  },
];

@NgModule({
  declarations: [
    ProjectsReportComponent,
    FilterProjectReportSidebarComponent,
    SubprocessProgressComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
    ],
  exports: [ ProjectsReportComponent, FilterProjectReportSidebarComponent ],
  providers: [
    ProjectReportService
  ]
})
export class ReportModule { }
