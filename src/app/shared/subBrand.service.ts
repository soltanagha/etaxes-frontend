import { HttpClient } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';


const API_URL = `${environment.apiUrl}`;
@Injectable({
    providedIn: 'root'
})
export class SubBrandService implements Resolve<any> {
  public subbrands: any;
  public onsubBrandChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  
  constructor(@SkipSelf() private _httpClient: HttpClient) {
    // Set the defaults
    this.onsubBrandChanged = new BehaviorSubject({});
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
    const url = `${API_URL}/subbrand/get`;
    return this._httpClient.get<any>(url);

  }
  getSAP(): Observable<any> {
    const url = `${API_URL}/subbrand/getSAP`;
    return this._httpClient.get<any>(url);

  }
}
