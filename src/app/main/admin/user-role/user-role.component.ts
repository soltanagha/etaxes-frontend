import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/models/user';
import { UserRoles } from 'app/models/userRoles';
import Swal from 'sweetalert2';
import { UserRoleService } from './user-role.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  public accountDetails = '';
  userId = null;
  accountForm: FormGroup
  public userData = { firstName: "", lastName: "", email: "", orgName:""};
  constructor(private formBuilder: FormBuilder,    
    private _userRoleService: UserRoleService,
    private route: ActivatedRoute,
    private router: Router,) { }

  get f() {
    return this.accountForm.controls
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.params['id'])
    this.initProjectForm();

   if (this.userId) {
    let userRolesById = this._userRoleService.GetNPTUserRolesById(this.userId);
    userRolesById.subscribe((response) => {
      this.userData = response;
      this.fillRoles();
    });
   }
    
  
  }
  
  initProjectForm() {
    this.accountForm = this.formBuilder.group({
      accountName: ['', Validators.required],
      // Project sub details ..................

      cover: [false],
      project: [false],
      label: [false],
      outerPacking: [false],
      innerPacking: [false],
      newProduct: [false],
    })
  }
  checkUser(){
    let user = new User(this.f['accountName'].value,"","","","",0 ,"", "");
      const userCheckOut = this._userRoleService.GetNPTUser(user);
      userCheckOut.subscribe(
        data => {
          this.userData = data;
          this.accountDetails = this.formatUserString(data);
          this.userId = data.Id;
        },
      error => console.log("Error checkUser: ",error),
      ).unsubscribe
  }

  saveUserRoles() {
      let userRoles: UserRoles[]= [];// = [new UserRoles(this.userId,2),new UserRoles(this.userId,3)]

      let accountForm = Object.entries(this.accountForm["controls"]);
      for (var i=1; i < accountForm.length; i++) {
          let formControlName = accountForm[i][0];
          let userRole = new UserRoles(this.userId,i);

          if(this.accountForm["controls"][formControlName].value)
            userRoles.push(userRole);

      }
      
      if (userRoles.length > 0) {
          const userRoleSave = this._userRoleService.InsertNPTUserRoles(userRoles);
          userRoleSave.subscribe({
            next(position) {
              Swal.fire('Düzəliş tamamlandı!', 'İstifadəçi məlumatları yadda saxlanıldı.', 'success')
            },
            error(msg) {
              console.error('Error Getting Location: ', msg)
            }},
          ).unsubscribe
      }
      this.router.navigate(['/admin/roles']);
  }

  fillRoles() {
    Object.keys(this.accountForm.controls).forEach(key => {
        if (key == "accountName") {
          let accountName = this.userData[key].split('@')[0];
          this.accountForm.controls[key].setValue(accountName);
        }
        else {
          this.accountForm.controls[key].setValue(this.userData[key]);
        }
      });  
  }

  formatUserString(user){
    return `Adı: ${user.firstName}
    Soyadı: ${user.lastName}  
    Email: ${user.email}  
    Təşkilat: ${user.orgName}`
  }

}
