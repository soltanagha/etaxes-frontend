import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { User } from 'app/models/user';
import { UserRoles } from 'app/models/userRoles';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { environment } from 'environments/environment';


const API_URL = `${environment.apiUrl}`;
@Injectable()
export class UserRoleService  {
  _userRole$ = new BehaviorSubject<UserRoles>(null);
  public onAdminChanged: BehaviorSubject<any>;
  private userNPTID;

  constructor(@SkipSelf() private _httpClient: HttpClient) {
    // Set the defaults
    this.onAdminChanged = new BehaviorSubject({});
  }
  InsertNPTUser(user: User): Observable<any> {
    const url = `${API_URL}/userrole/insertnptuser`;
    const config = {
        headers: new HttpHeaders().set("Content-Type", "application/json"),
    };
    return this._httpClient.post(url, user, config).pipe(
        catchError((error) => {
          return of(null);
        })
      );
    }

    GetSAPUser(accountName: string): Observable<any> {
      const url = `${API_URL}/userrole/getsapuser`;
      const config = {
          headers: new HttpHeaders().set("Content-Type", "application/json"),
      };
      return this._httpClient.post(url, accountName, config).pipe(
          catchError((error) => {
            return of(null);
          })
        );
      }

    GetNPTUser(user: User): Observable<any> {
        const url = `${API_URL}/userrole/GetNPTUser/`;
        const config = {
            headers: new HttpHeaders().set("Content-Type", "application/json"),
        };
        
        const accountName= JSON.stringify(user.AccountName);
        return this._httpClient.post(url, accountName,config).pipe(
          concatMap((userNPT: any) => {
            if (userNPT == null || !('id' in userNPT)) {
              return this.GetSAPUser(accountName);
            }
            else {
              user = userNPT;
              user.Id = userNPT.id;
              return of(user);
            }           
            
          }),
          concatMap((user: any) => {
            return (user.Id == null || user.Id == undefined) ?
              this.InsertNPTUser(user): of(user)
            }
            //concatMap(userID => this.InsertNPTUserRoles(userRoles,Number(userID)))
        ));
        }
        GetNPTUserRolesById(id): Observable<any>{
          const url = `${API_URL}/userrole/GetNPTUserRoles/`+id;    
          return this._httpClient.get<any>(url);
        }
    InsertNPTUserRoles(userRoles: UserRoles[]): Observable<any> {
          const url = `${API_URL}/userrole/InsertNPTUserRoles`;
          const config = {
              headers: new HttpHeaders().set("Content-Type", "application/json"),
          };
          return this._httpClient.post(url, userRoles, config).pipe(
              catchError((error) => {
                return of(null);
              })
            );
        }

    
}
