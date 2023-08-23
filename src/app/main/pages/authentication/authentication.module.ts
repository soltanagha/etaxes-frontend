import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CoreCommonModule } from "@core/common.module";

import { AuthLoginV2Component } from "./auth-login-v2/auth-login-v2.component";
import { MiscellaneousModule } from "../miscellaneous/miscellaneous.module";
import { AuthGuard } from "app/auth/helpers";

// routing
const routes: Routes = [
	{
    path: 'authentication/login',
    component: AuthLoginV2Component,
    data: { animation: 'auth' }
	},
];

@NgModule({
	declarations: [AuthLoginV2Component],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		CoreCommonModule,

	],
})
export class AuthenticationModule {}

