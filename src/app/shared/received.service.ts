import { HttpClient } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestData } from './request-body/request-data';
import { ReceivedList } from 'app/models/received-list';

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class Received {
  public received: any;
  public onReceivedChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} http
   */
  
  constructor(@SkipSelf() private http: HttpClient) {
    // Set the defaults
    this.onReceivedChanged = new BehaviorSubject({});
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
      Promise.all([this.get(
        // TODO
        null)]).then(() => {
        resolve();
      }, reject);
    });
  }

get(requestParams: RequestData): Observable<any> {
    const url = `${API_URL}/api/Gelenler`;
    return this.http.post<ReceivedList>(url,requestParams);
  }
  
}
