import { Injectable } from "@angular/core";
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "environments/environment";
import { AuthenticationService } from "app/auth/service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	/**
	 *
	 * @param {AuthenticationService} _authenticationService
	 */
	constructor(private _authenticationService: AuthenticationService) {}

	/**
	 * Add auth header with jwt if user is logged in and request is to api url
	 * @param request
	 * @param next
	 */
	intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
		const currentUser = this._authenticationService.currentUserValue;
		const isLoggedIn = currentUser && currentUser.Token;
		const isApiUrl = request.url.startsWith(environment.apiUrl);		

		if (isLoggedIn) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${currentUser.Token}`,
				},
			});
		}

		return next.handle(request);
	}
}
