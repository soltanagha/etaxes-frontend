import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core'

import { Observable, Subject, Subscription } from 'rxjs'
import Stepper from 'bs-stepper'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { repeaterAnimation } from 'app/main/project/project-edit/form-repeater.animation'
import { FileUploader } from 'ng2-file-upload'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { BrandService } from 'app/shared/brand.service'
import { CategoryService } from 'app/shared/category.service'
import { RiskRatingService } from 'app/shared/risk-rating.service'
import { StatusService } from 'app/shared/status.service'
import { SaleChannelService } from 'app/shared/sale-channel.service'
import { SubBrandService } from 'app/shared/subBrand.service'
import { ProjectService } from 'app/shared/project.service'
import { ProjectEditService } from './project-edit.service'
import { ProjectAdd } from 'app/models/project-add'
import { ProjectSubProcess } from 'app/models/project-subprocess'
import Swal from 'sweetalert2'
import { saveAs } from 'file-saver'

import { HttpErrorResponse, HttpEventType } from '@angular/common/http'
import { ProjectDetail } from 'app/models/project-detail'
import { Role } from 'app/auth/models'
import { ItemGroupService } from 'app/shared/item-group.service'
const URL = 'https://your-url.com'

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectEditComponent implements OnInit, OnDestroy {
  projectForm: FormGroup;
  projectDetails: FormGroup;
  projectSubProcesses: FormGroup;
  id: number;
  editMode = false;
  public contentHeader: object;
  public TDProjectNameVar;
  public previousProject;
  public sidebarToggleRef = false;
  private modernWizardStepper: Stepper;
  private bsStepper;
  public brandSelect$: Observable<any[]>;
  public subBrandSelect$: Observable<any>;
  public categorySelect$: Observable<any>;
  public riskRatingSelect$: Observable<any[]>;
  public statusSelect$: Observable<any>;
  public saleChannelSelect$: Observable<any>;
  public itemGroupSelect$: Observable<any>;
  public brandSelected;

  // Private
  private issue = true;
  private _unsubscribeAll: Subject<any>;
  project$: Observable<any>;
  updateProject: Subscription;
  projectSubProcessesID: Array<number> = [];
  public filePath = undefined;
  public coverFile = undefined;
  public labelFile = undefined;
  public outerPackingFile = undefined;
  public innerPackingFile = undefined;
  public newProductFile = undefined;
  public filePathLabel = 'Əlavə seçin';
  public coverFileLabel = 'Əlavə seçin';
  public labelFileLabel = 'Əlavə seçin';
  public outerPackingFileLabel = 'Əlavə seçin';
  public innerPackingFileLabel = 'Əlavə seçin';
  public newProductFileLabel = 'Əlavə seçin';

  //Status of Subprocesses
  public coverStatusLabel = 'Göndərilməyib';
  public labelStatusLabel = 'Göndərilməyib';
  public outerPackingStatusLabel = 'Göndərilməyib';
  public innerPackingStatusLabel = 'Göndərilməyib';
  public newProductStatusLabel = 'Göndərilməyib';


  //Permission by subprocesses
  public isInnerPackingPermission = false;
  public isCoverPermission = false;
  public isLabelPermission = false;
  public isOuterPackingPermission = false;
  public isNewProductPermission = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _projectService: ProjectService,
    private _brandService: BrandService,
    private _categoryService: CategoryService,
    private _riskRatingService: RiskRatingService,
    private _statusService: StatusService,
    private _saleChannelService: SaleChannelService,
    private _subBrandService: SubBrandService,
    private _projectEditService: ProjectEditService,
    private _itemGroupService: ItemGroupService

  ) {
    this._unsubscribeAll = new Subject()
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */

  get projecDetails() {
    return this.projectForm["controls"].projecDetails["controls"]
  }

  get projecSubProcesses() {
    return this.projectForm["controls"].projectSubProcesses["controls"]
  }

  ngOnInit(): void {
    //this.id = Number(this.route.snapshot.params['id']);
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
      }
    );
    this.initProjectForm();
    this.loadSelect();
    this.modernWizardStepper = new Stepper(
      document.querySelector('#stepper3'),
      {
        linear: false,
        animation: true,
      },
    )
    this.bsStepper = document.querySelectorAll('.bs-stepper')

    /*this.updateProject = this._projectEditService
    .updateProjectAndSubProcecesses()
     .subscribe((response) => {
      if (!this.issue) 
        this.router.navigate(['/project/list'])
     });*/
    if (this.editMode) {
      this.loadProject();
      this.loadProjectSubProcesses();
    }


    this.initPermission();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    if (this.updateProject)
      this.updateProject.unsubscribe();
  }

  public uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true,
  })

  /**
   * Modern Horizontal Wizard Stepper Next
   */

  modernHorizontalNext() {
    if (this.projectForm.valid === true) {
      this.modernWizardStepper.next()
    }
  }
  /**
   * Modern Horizontal Wizard Stepper Previous
   */
  modernHorizontalPrevious() {
    this.modernWizardStepper.previous()
  }

  initProjectForm() {
    this.projectForm = this.formBuilder.group({
      projectDetails: this.formBuilder.group({
        name: ['', Validators.required],
        target: ['', Validators.required],
        owner: ['', Validators.required],
        argeOwner: ['', Validators.required],
        brandID: [1, Validators.required],
        subBrandID: ['', Validators.required],
        categoryID: [1, Validators.required],
        saleChannelID: [1, Validators.required],
        statusID: [1, Validators.required],
        itemCode: ['', Validators.required],
        itemName: ['', Validators.required],
        itemPrice: [0, [Validators.required, Validators.pattern(/^\d{0,}(\.\d{0,2}){0,1}$/)]],
        itemGroupID: [0],
        profitability: [0, [Validators.required, Validators.pattern(/^\d{0,}(\.\d{0,2}){0,1}$/)]],
        estimatedSalesTurnover: [0, [Validators.required, Validators.pattern(/^\d{0,}(\.\d{0,2}){0,1}$/)]],
        incrementalTurnover: [0, [Validators.required, Validators.pattern(/^\d{0,}(\.\d{0,2}){0,1}$/)]],
        marketResearch: [false, Validators.required],
        marketResearchDescription: ['', Validators.required],
        investment: [false, Validators.required],
        investmentDescription: ['', Validators.required],
        riskRatingID: [1, Validators.required],
        riskRatingDescription: ['', Validators.required],
        description: [''],
        filePath: [''],
        file: [''],
        deactivated: [false, Validators.required],
      }),
      
      // Project sub details ..................
      projectSubProcesses: this.formBuilder.group({
        cover: [false], // 2 | 0
        coverDescription: [''],
        label: [false], // 3 | 2
        labelDescription: [''],
        outerPacking: [false], //4 | 2(n-2)
        outerPackingDescription: [''],
        innerPacking: [false], //5 | 6
        innerPackingDescription: [''],
        newProduct: [false], //6 | 8
        newProductDescription: [''],
      })
    })
  }

  loadSelect() {
    this.brandSelect$ = this._brandService.get();
    this.categorySelect$ = this._categoryService.getSAP();
    this.riskRatingSelect$ = this._riskRatingService.get();
    this.statusSelect$ = this._statusService.get();
    this.saleChannelSelect$ = this._saleChannelService.get();
    this.subBrandSelect$ = this._subBrandService.getSAP();
    this.itemGroupSelect$ = this._itemGroupService.get();;
  }

  loadProject() {
    let project = this._projectEditService.get(this.id);
    project.subscribe((response) => {
      this.projectForm.get("projectDetails").patchValue(response);
      this.projectForm.get("projectSubProcesses").patchValue(response);
      this.filePath = response.filePath;
      this.filePathLabel = response.filePath;
      this.previousProject = response;
    })
  }

  loadProjectSubProcesses() {
    let projectSubProcesses = this._projectEditService.getSubProcesses(this.id)

    projectSubProcesses.subscribe((response) => {
      response.forEach((item) => {
        
        let index = 2*(item.subprocessID-2);
        let projectSubProcessesArray = Object.entries(this.projectForm["controls"].projectSubProcesses["controls"]);  // formControlName = innerPacking
        let formCN = projectSubProcessesArray[index];  // formControl Object
        let formControlName = formCN[0];  // formControlName = innerPacking
        
        this.setValueToControls(formControlName, true);
        this.setValueToControls(formControlName + 'Description', item.subprocessDescription);
        this.setValueToVar(formControlName + 'FileLabel', item.filePath);
        this.setValueToVar(formControlName + 'File', item.filePath);
        this.statusOfSubprocess(formControlName + 'StatusLabel', item.statusID);
        this.projectSubProcessesID.push(item.subprocessID);
      })
    })
  }

  submitForm() {
    if (this.projectForm.valid) {
      let updateArrayOfSubProcess = [];
      let insertArrayOfSubProcess = [];
      //let deleteArrayOfSubProcess = []
      let _projectDetails = new ProjectDetail();
      interface deleteArray {
        Item1: string;
        Item2: number;
      }

      let deleteArrayOfSubProcess: deleteArray[] = [];

      const newProject = new ProjectAdd();
      let subProcessesFiles = new FormData();
      let projectFile = new FormData();
      subProcessesFiles.append('id', String(this.id));
     
      projectFile.append('file', this.filePath);
      _projectDetails.file = projectFile;
      newProject.fillProjectWithFCG(this.projectForm.getRawValue());

      let projectSubProcessesArray = Object.entries(this.projectForm["controls"].projectSubProcesses["controls"]);
      let index = 2; //Database de subprocess id ler 2 den baslayir. (1=Project)
      projectSubProcessesArray.forEach(element => {

        if (!element[0].includes('Description')) {
          let formControlName = element[0];
          if (this.editMode) {
            
            if (this.projecSubProcesses[formControlName].value && this.projectSubProcessesID.includes(index))
              this.createAndPushSubProcess(index, this.projecSubProcesses[formControlName + 'Description'].value, updateArrayOfSubProcess)
            else if (this.projecSubProcesses[formControlName].value)
              this.createAndPushSubProcess(index, this.projecSubProcesses[formControlName + 'Description'].value, insertArrayOfSubProcess)
            else if (!this.projecSubProcesses[formControlName].value && this.projectSubProcessesID.includes(index))
              deleteArrayOfSubProcess.push({ Item1: formControlName, Item2: index })
          }
          else if (this.projecSubProcesses[formControlName].value && !this.editMode) {
            this.createAndPushSubProcess(index, this.projecSubProcesses[formControlName + 'Description'].value, insertArrayOfSubProcess)
          }

          if (this[formControlName + 'File'] != undefined) {
            subProcessesFiles.append(String(index), this[formControlName + 'File']);
          }
          index++;
        }

      });
      
      if (this.editMode) {
        newProject.id = this.id;
        let updateProjectSubProcesses: { subprocesses: any } = {
          subprocesses: updateArrayOfSubProcess,
        }
        if (insertArrayOfSubProcess.length > 0) {
          let insertProjectSubProcesses: { subprocesses: any } = {
            subprocesses: insertArrayOfSubProcess,
          }
          const createSubProcess = this._projectService.createSubProcesses(insertProjectSubProcesses, this.id,);
          createSubProcess
            .subscribe({
              next(position) {
                // console.log('Current Position: ', position)
              },
              error(msg) {
                // console.log('Error Getting Location: ', msg)
              },
            }).unsubscribe;
        }

        if (deleteArrayOfSubProcess.length > 0) {
          deleteArrayOfSubProcess.push({ Item1: "projectID", Item2: this.id })

          const createSubProcess = this._projectEditService.deleteSubProcesses(deleteArrayOfSubProcess)
          createSubProcess.subscribe({
            next(position) {
              // console.log('Current Position: ', position)
            },
            error(msg) {
               console.error('Error Getting Location: ', msg)
            },
          }).unsubscribe
        }

        newProject.projectSubProcess = updateProjectSubProcesses;
        _projectDetails.project = newProject;
        _projectDetails.subProcessesFiles = subProcessesFiles;
        this.updateProject = this._projectEditService.UpdateProject(_projectDetails)
          .subscribe(
            (response) => {
              Swal.fire('Düzəliş tamamlandı!', 'Proyekt yadda saxlanıldı.', 'success');
              this.router.navigate(['/project/list'])
            },
            error => {
              console.error(error)
            });
      } else {
        // Create new Project
        let insertSubProcess: { subprocesses: any } = {
          subprocesses: insertArrayOfSubProcess,
        }
        newProject.projectSubProcess = insertSubProcess;
        newProject.itemPrice = +newProject.itemPrice;
        newProject.profitability = +newProject.profitability;
        newProject.estimatedSalesTurnover = +newProject.estimatedSalesTurnover;
        
        newProject.incrementalTurnover = +newProject.incrementalTurnover;
        newProject.userID = this._projectService.currentUser.Id;
        _projectDetails.project = newProject;
        _projectDetails.subProcessesFiles = subProcessesFiles;
        this.updateProject = this._projectEditService.CreateProject(_projectDetails)
          .subscribe(
            (response) => {
              Swal.fire('Proyekt əlavə edildi!', 'Proyekt uğurla yaradıldı.', 'success');
              this.router.navigate(['/project/list']);
            },
            error => {
              console.error(error)
            });

      }

      this.issue = false;

      // this.router.navigate(['/project/list']);
    } else {
      Swal.fire('Xəta baş verdi!', 'Məlumatlar tam daxil edilməyib!', 'error');
    }
  }

  createAndPushSubProcess(subProcessID, subProcessValue, array) {
    let projectCover = new ProjectSubProcess(subProcessID, this.id, 2, subProcessValue, "")

    array.push(projectCover)
  }

  downloadFile(id): void {
    this._projectService.DownloadFile(id).subscribe(
      (event) => {
        if (event.type == HttpEventType.Response) {
          saveAs(
            new File([event.body!], 'Alt proyekt sənədi', {
              type: `${event.headers.get('Content-Type')};charset=utf-8`,
            }),
          )
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error)
      },
    ).unsubscribe
  }

  downloadSubProcessesFile(controlName): void {
    let filename = this[controlName]

    this._projectEditService.downloadFile(filename).subscribe(
      (event) => {
        if (event.type == HttpEventType.Response) {
          saveAs(
            new File([event.body!], filename, {
              type: `${event.headers.get('Content-Type')};charset=utf-8`,
            }),
          )
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error)
      },
    ).unsubscribe
  }

  onFileChange(varName, event) {
    if (event.target.files.length != 0) {
      this[varName] = event.target.files[0]
      this[varName + 'Label'] = event.target.files[0].name
    }
  }

  isFile = (controlName: string): Boolean => {

    return this[controlName] === undefined ||
      typeof this[controlName] != "string" ||
      this[controlName] == "" ||
      this[controlName] == null;
  }

  checkControlsDisable(checkName, disableName) {
    if (!this.projecSubProcesses[checkName].value)
      this.projecSubProcesses[disableName].disable();
    else
      this.projecSubProcesses[disableName].enable();
  }

  setValueToControls(name, value) {
    this.projecSubProcesses[name].setValue(value)
  }

  setValueToVar(varName, value) {
    this[varName] = value
  }

  onCheckBoxChange(controlName: string, event) {
    let controlNameDescription = controlName + 'Description';
    let isPermission = 'is' + this.capitalizeFirstLetter(controlName) + 'Permission';
    this.setValueToControls(controlNameDescription, "");
    this.setValueToVar(controlName + 'File', undefined);
    this.setValueToVar(controlName + 'FileLabel', "");
    this.setValueToVar(isPermission, this.projecSubProcesses[controlName].value);
    this.checkControlsDisable(controlName, controlNameDescription);
  }

  statusOfSubprocess(varName, value) {
    switch (value) {
      case 1:
        this[varName] = "Göndərilməyib"
        break
      case 2:
        this[varName] = "Gözləmədə"
        break
      case 3:
        this[varName] = "Təsdiq edilib"
        break
    }
  }

  sendSubprocess(varName) {
    this[varName] = "Gözləmədə"
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  initPermission() {
    let projectSubProcessesArray = Object.entries(this.projectForm["controls"].projectSubProcesses["controls"]);

    projectSubProcessesArray.forEach(element => {
      if (!element[0].includes('Description') ) {
        let formControlName = element[0];
        let capitalizeFirstLetter = this.capitalizeFirstLetter(formControlName);

         if (this._projectService.currentUser.Role != Role.Admin && this._projectService.currentUser["Project"] === 'False') {
          this["is" + capitalizeFirstLetter + "Permission"] = (this._projectService.currentUser[capitalizeFirstLetter] === 'True');
          if (!this["is" + capitalizeFirstLetter + "Permission"])
            this.disableSubProcess(formControlName);
         } else {
           this["is" + capitalizeFirstLetter + "Permission"] = true;
         }

      }
    });

    if (this._projectService.currentUser["Project"] === 'False')
      this.projectForm.get('projectDetails').disable();
  }

  disableSubProcess(controlName: string) {
    let controlNameDescription = controlName + 'Description';
    this.projecSubProcesses[controlName].disable();
    this.projecSubProcesses[controlNameDescription].disable();
  }

  userHavePermission(controlName: string) {

    if (controlName == "innerPacking")
      return (this._projectService.currentUser.Role == Role.InnerPackingOnly ? false : true);

    else if (controlName == "cover")
      return (this._projectService.currentUser.Role == Role.CoverOnly ? false : true);

    else if (controlName == "outerPacking")
      return (this._projectService.currentUser.Role == Role.OuterPackingOnly ? false : true);

    else if (controlName == "newProduct")
      return (this._projectService.currentUser.Role == Role.NewProductOnly ? false : true);

    else if (controlName == "label")
      return (this._projectService.currentUser.Role == Role.LabelOnly ? false : true);

    else if (controlName == "projectDetails")
      return (this._projectService.currentUser.Role == Role.ProjectDetailsOnly ? false : true);
  }

}
