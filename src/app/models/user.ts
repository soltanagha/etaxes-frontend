export class User {
    Id?: number;
    AccountName: string;
    Email: string;
    FirstName: string;
    LastName: string;
    FatherName: string;
    OrgCode: number;
    OrgName: string;
    Position: string;

    constructor(accountName,email,firsName,
        lastName,fatherName, orgCode,orgName, position) {
          this.AccountName = accountName;
          this.Email = email;
          this.FirstName = firsName;
          this.LastName = lastName;
          this.FatherName = fatherName;
          this.OrgCode = orgCode;
          this.OrgName = orgName;
          this.Position = position;
        }

}  