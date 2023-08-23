import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import jwtDecode from "jwt-decode";

import { environment } from "environments/environment";
import { User, Role } from "app/auth/models";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "./cookie.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
	//public
	public currentUser: Observable<User>;
	public user: User;

	//private
	private currentUserSubject: BehaviorSubject<User>;

	/**
	 *
	 * @param {HttpClient} _http
	 * @param {ToastrService} _toastrService
	 */
	constructor(
		private _http: HttpClient,
		private _toastrService: ToastrService,
		private cookieService: CookieService
	) {
		const cookie = this.cookieService.getCookie("currentUser");
		this.user = cookie != null ? jwtDecode<User>(cookie!) : null;
		this.user ? (this.user.Token = cookie) : null;
		this.user ? (this.user.Role = Role[this.user.RoleType]) : null;


		this.currentUserSubject = new BehaviorSubject<User>(this.user);
		this.currentUser = this.currentUserSubject.asObservable();
	}

	// getter: currentUserValue
	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

	/**
	 *  Confirms if user is admin
	 */
	get isAdmin() {
		return (
			this.currentUser &&
			this.currentUserSubject.value.Role === Role.Admin
		);
	}

	/**
	 *  Confirms if user is client
	 */
	get isClient() {
		return (
			this.currentUser &&
			this.currentUserSubject.value.Role === Role.Client
		);
	}

	/**
	 * User login
	 *
	 * @param email
	 * @param password
	 * @returns user
	 */
	login(email: string, password: string) {
		const url = `${environment.apiUrl}/account/login`;
		const data = {
			Username: email,
			Password: password,
			Domain: "SGOFC.COM",
		};
		const config = {
			headers: new HttpHeaders().set("Content-Type", "application/json"),
		};

		return this._http.post<any>(url, data, config).pipe(
			map((data) => {
				// login successful if there's a jwt token in the response
				if (data && data.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					this.cookieService.setCookie("currentUser", data.token, 10);
					//this.cookieService.setCookie("currentUserRoles", JSON.stringify(data.userRole), 10);

					this.user = jwtDecode<User>(data.token);
					this.user.Token = data.token;
					
					this.user.Role = Role[this.user.RoleType];
					// Display welcome toast!
					setTimeout(() => {
						this._toastrService.success(
							"Hörmətli " +
								this.user.FirstName +
								" " +
								this.user.LastName +
								", sistemə uğurla daxil oldunuz! 🎉",
							"👋 Salam, " + this.user.FirstName + "!",
							{
								toastClass: "toast ngx-toastr",
								closeButton: true,
							}
						);
					}, 2500);
					
					// notify
					this.currentUserSubject.next(this.user);
				}

				return data;
			},
			(error) => {
				console.error("Error onSubmit():",error);
				//this.error = error;
				//this.loading = false;
			}),
			
			
		);
	}

	/**
	 * User logout
	 *
	 */
	logout() {
		// remove user from local storage to log user out
		this.cookieService.deleteCookie("currentUser");
		// notify
		this.currentUserSubject.next(null);
	}

}
