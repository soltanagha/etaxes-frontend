import { Role } from "./role";

export class User {
	// id: number;
	// email: string;
	// password: string;
	// firstName: string;
	// lastName: string;
	// avatar: string;
	// role: Role;
	// token?: string;

	Id: number;
	AccountName?: string;
	Email?: string;
	FirstName: string;
	LastName: string;
	FatherName?: string;
	Token?: string;
	Role: Role;
	RoleType?: string;
	Project?: string;
    Cover?: string;
    Label?: string;
    InnerPacking?: string;
    OuterPacking?: string;
    NewProduct?: string;    
}
