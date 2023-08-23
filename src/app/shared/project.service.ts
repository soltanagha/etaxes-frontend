import { Injectable, SkipSelf } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { HttpClient, HttpEvent } from "@angular/common/http";
import { catchError, concatMap, filter, switchMap } from "rxjs/operators";
import { ProjectAdd } from "app/models/project-add";
import { ProjectDetail } from "app/models/project-detail";
import { User } from "app/auth/models";
import { AuthenticationService } from "app/auth/service";
import { environment } from 'environments/environment';


const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  _projectCreation$ = new BehaviorSubject<ProjectDetail>(null);
  currentUser: User;

  createProjectSub(): Observable<any> {
    return this._projectCreation$.pipe(filter((el) => el != null)).pipe(
      switchMap((projectDetails) => {

        return this.createProject(projectDetails.project).pipe(
          concatMap(projectID => (projectDetails.file) ? this.uploadProjectFile(projectDetails.file,projectID) : projectID ),
          // concatMap(projectID => this.uploadProjectFile(projectDetails.file,projectID)),
          concatMap(projectID => this.createSubProcesses(projectDetails.project.projectSubProcess,projectID)),
          concatMap(projectID => this.uploadSubProjectFiles(projectDetails.subProcessesFiles,projectID)),
          concatMap(projectID => this.defineSubprocessProgress(projectID)),
        );
      })
    );
  }

  createProject(project: ProjectAdd): Observable<any> {
    const url = `${API_URL}/project/create`;

    return this.http.post(url, project).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  createSubProcesses(projectSubProcessList,id): Observable<any> {

    projectSubProcessList.subprocesses.forEach(item => item.projectID = id);
    const url = `${API_URL}/ProjectSubProcess/create`;
    return this.http.post(url, projectSubProcessList).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  uploadProjectFile(file: FormData, id): Observable<any> {
    const url = `${API_URL}/project/uploadFile`;
    file.append("id",id);
    return this.http.post(url, file).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  DownloadFile(id) : Observable<HttpEvent<Blob>>{
    let apiurl = `${API_URL}/project/DownloadFile/${id}`;
    return this.http.get(`${apiurl}`, {
      reportProgress:true,
      observe: 'events',
      responseType :'blob'
    });
  }
  
  uploadSubProjectFiles(files,id): Observable<any> {
    const url = `${API_URL}/ProjectSubProcess/uploadFile`;
    files.append("id",id);
    return this.http.post(url, files).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

defineSubprocessProgress(id): Observable<any> {
  const url = `${API_URL}/subprocessprogress/DefineEmptyProgresses`;
  return this.http.post(url, id).pipe(
    catchError((error) => {
      return of(null);
    })
  );
}

  constructor(@SkipSelf() private http: HttpClient, private _authenticationService: AuthenticationService) {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));    
  }

}
