import { Injectable, SkipSelf } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap} from 'rxjs/operators';
import { ProjectState, TableResponse } from '../../project/project-state.model';
import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';


const API_URL = `${environment.apiUrl}`;
@Injectable({
    providedIn: "root",
  })
export class ProjectReportService<T = any> {
    public onProjectsChanged: BehaviorSubject<any>;
    private _items$ = new BehaviorSubject<T[]>([]);
    currentUser: User;

    constructor(@SkipSelf() private http: HttpClient,
	private _authenticationService: AuthenticationService) {
        this.onProjectsChanged = new BehaviorSubject({});

		this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    }

    get items$() {
		return this._items$.asObservable();
	}

    getProjects(): Observable<any> {
        return this.http.get(`${API_URL}/project/get`)
    }

    deleteProject(id): Observable<any> {
        return this.http.delete(`${API_URL}/project/delete/`+id)
    }

    
	fill(tableState: ProjectState): Observable<TableResponse<T>> {
		const url = `${API_URL}/project/GetTableForReport`;
		const config = {
			headers: new HttpHeaders().set("Content-Type", "application/json"),
		};
		var request = this.http.post<any>(url, tableState, config).pipe(
			tap((result: TableResponse<T>) => {
				if (result != null && result.items != null) {
					this._items$.next(result.items);
				} else {
					this._items$.next([]);
				}
			})
		);
		return request;
	}

	updateProgress(subprocessProgressList):Observable<any> { 
		const url = `${API_URL}/subprocessProgress/InsertNewProgresses`;
		const config = {
			headers: new HttpHeaders().set("Content-Type", "application/json"),
		};
		return this.http.post<any>(url, subprocessProgressList , config);
	}
	
	GetProgressByID(id: string):Observable<any> { 
		const url = `${API_URL}/SubprocessProgress/GetSubprocessProgressByProjectID/`+id;
		const config = {
			headers: new HttpHeaders().set("Content-Type", "application/json"),
		};
		return this.http.get<any>(url);
	}

	GetProgressHistoryBySubprocessID(id: string):Observable<any> {
		const url = `${API_URL}/SubprocessProgress/GetSubprocessProgressBySubprocessID/`+id;
		const config = {
			headers: new HttpHeaders().set("Content-Type", "application/json"),
		};
		return this.http.get<any>(url);
	}
}
