import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { ProjectAdd } from 'app/models/project-add';
import { ProjectDetail } from 'app/models/project-detail';

import { BehaviorSubject, isObservable, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, take } from 'rxjs/operators';
import { environment } from 'environments/environment';


const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})


export class ProjectEditService {
  public onProjectEditChanged: BehaviorSubject<any>;
  _projectEdit$ = new BehaviorSubject<ProjectDetail>(null);

  
 
  constructor(@SkipSelf() private _httpClient: HttpClient) {
    this.onProjectEditChanged = new BehaviorSubject({});
  }

  get(id): Observable<any>{
    const url = `${API_URL}/project/get/`+id;    
    return this._httpClient.get<any>(url);
  }

  getSubProcesses(id): Observable<any>{
    const url = `${API_URL}/projectsubprocess/get/`+id;    
    return this._httpClient.get<any>(url);
  }

  CreateProject(projectDetails: ProjectDetail): Observable<any> {
    const url = `${API_URL}/project/create`;
    return this._httpClient.post(url, projectDetails.project).pipe(
          concatMap(projectID => this.createSubProcesses(projectDetails.project.projectSubProcess,projectID)),
          concatMap(projectID => this.uploadSubProjectFiles(projectDetails.subProcessesFiles,projectID)),
          concatMap(projectID => this.defineSubprocessProgress(projectID)),
          concatMap(projectID => (projectDetails.file) ? this.uploadProjectFile(projectDetails.file, projectID) : of(projectID) ),
    );
  }

  UpdateProject(projectDetails: ProjectDetail): Observable<any> {
    const url = `${API_URL}/project/edit`;
    
    return this._httpClient.post(url, projectDetails.project).pipe(
      concatMap(projectID => this.updateSubProcesses(projectDetails.project.projectSubProcess)),
      concatMap(projectID => this.uploadSubProjectFiles(projectDetails.subProcessesFiles,projectDetails.project.id)),
      concatMap(projectID => this.defineSubprocessProgress(projectDetails.project.id)),
      concatMap(projectID => (projectDetails.file) ? this.uploadProjectFile(projectDetails.file, projectDetails.project.id) : of(projectDetails.project.id) ),
      );
  }

  updateProjectAndSubProcecesses(): Observable<any> {
    return this._projectEdit$.pipe(filter((el) => el != null)).pipe(
      switchMap((project) => {
        return this.updateProject(project.project).pipe(
          concatMap(projectID => this.updateSubProcesses(project.project.projectSubProcess)),
          concatMap(projectID => this.uploadSubProjectFiles(project.subProcessesFiles,project.project.id)),
          concatMap(projectID => this.defineSubprocessProgress(project.project.id)),
          concatMap(projectID => (project.file) ? this.uploadProjectFile(project.file, project.project.id) : of(project.project.id) ),
        );
      })
    );
  }

  updateProject(project: ProjectAdd): Observable<any> {
    const url = `${API_URL}/project/edit`;
    return this._httpClient.post(url, project).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  
  // START SubProcess management

  createSubProcesses(projectSubProcessList,id): Observable<any> {
    projectSubProcessList.subprocesses.forEach(item => item.projectID = id);
    const url = `${API_URL}/ProjectSubProcess/create`;
    return this._httpClient.post(url, projectSubProcessList).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  updateSubProcesses(projectSubProcessList): Observable<any> {
    const url = `${API_URL}/ProjectSubProcess/edit`;
    return this._httpClient.post(url, projectSubProcessList).pipe(
      catchError((error) => {
        return of(error);
      })
    );
  }

  deleteSubProcesses(deleteList): Observable<any> {
    const url = `${API_URL}/ProjectSubProcess/delete`;
    return this._httpClient.post(url, deleteList).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  defineSubprocessProgress(id): Observable<any> {
    const url = `${API_URL}/subprocessprogress/DefineEmptyProgresses`;
    return this._httpClient.post(url, Number(id)).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  //END SubProcess management

  // START File management
  uploadProjectFile(file: FormData, id): Observable<any> {
    const url = `${API_URL}/project/uploadFile`;
      
    if (id != null) {
      file.append("id",id);
    }
    //console.log(id);
    return this._httpClient.post(url, file).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  uploadSubProjectFiles(files, id=null): Observable<any> {
    const url = `${API_URL}/ProjectSubProcess/uploadFile/`+id;
    
    if (id != null) {
      files.append("id",id);
    }

    return this._httpClient.post(url, files).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  downloadFile(filename) : Observable<HttpEvent<Blob>>{
    let apiurl = `${API_URL}/ProjectSubProcess/downloadFile/${filename}`;
    return this._httpClient.get(`${apiurl}`, {
      reportProgress:true,
      observe: 'events',
      responseType :'blob'
    });
  }

  // END File management


}
