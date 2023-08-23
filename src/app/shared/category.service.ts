import { HttpClient } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';


const API_URL = `${environment.apiUrl}`;
@Injectable({
    providedIn: 'root'
})
export class CategoryService implements Resolve<any> {
  public categories: any;
  public onCategroryChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  
  constructor(@SkipSelf() private _httpClient: HttpClient) {
    // Set the defaults
    this.onCategroryChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.get()]).then(() => {
        resolve();
      }, reject);
    });
  }


  get(): Observable<any> {
    const url = `${API_URL}/category/get`;
    return this._httpClient.get<any>(url);
  }

  getSAP(): Observable<any> {
    const url = `${API_URL}/category/getSAP`;
    return this._httpClient.get<any>(url);
  }
}
