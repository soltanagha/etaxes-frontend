export class UserRoles {
    Id?: number;
    userID: number;
    roleID: number;

    constructor(userID,roleID){
        this.userID = userID;
        this.roleID = roleID;
    }

}