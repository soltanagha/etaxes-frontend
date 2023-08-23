import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';


const API_URL = `${environment.apiUrl}`;
@Injectable({ providedIn: 'root' })
export class AdminService implements Resolve<any> {
  rows: any;
	onDatatablessChanged: BehaviorSubject<any>;

	/**
	 * Constructor
	 *
	 * @param {HttpClient} _httpClient
	 */
	constructor(@SkipSelf() private _httpClient: HttpClient) {
		// Set the defaults
		this.onDatatablessChanged = new BehaviorSubject({});
	}

	/**
	 * Resolver
	 *
	 * @param {ActivatedRouteSnapshot} route
	 * @param {RouterStateSnapshot} state
	 * @returns {Observable<any> | Promise<any> | any}
	 */
	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<any> | Promise<any> | any {
		return new Promise<void>((resolve, reject) => {
			Promise.all([this.getDataTableRows()]).then(() => {
				resolve();
			}, reject);
		});
	}

	/**
	 * Get rows
	 */
	getDataTableRows(): Promise<any[]> {
	
		return new Promise((resolve, reject) => {
			this._httpClient
				.get(`${API_URL}/userrole/getnptuserrolelist`)
				.subscribe((response: any) => {
					this.rows = response;
					this.onDatatablessChanged.next(this.rows);
					resolve(this.rows);
				}, reject);
		});
	}
    
}
