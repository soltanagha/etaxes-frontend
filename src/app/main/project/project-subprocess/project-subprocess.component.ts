import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  ColumnMode,
  SelectionType,
} from "@swimlane/ngx-datatable";
import * as snippet from "app/main/project/project-list/datatables.snippetcode";
import { ProjectSubprocessProgressService } from "./project-subprocess.service";
import { Observable, Subject } from "rxjs";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ProjectState } from "../project-state.model";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";


@Component({
  selector: "app-project-subprocess",
  templateUrl: "./project-subprocess.component.html",
  styleUrls: ["./project-subprocess.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectSubprocessComponent implements OnInit {
  // Private
  private _unsubscribeAll: Subject<any>;
  private tempData;
  public rows$: Observable<any>;
	public rows: any;
  public searchValue = "";
  public _projectState: ProjectState = new ProjectState();
	public loading: boolean = true;
  closeResult = "";
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public contentHeader: object;
  public expanded = {};
  public ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  public _snippetCodeKitchenSink = snippet.snippetCodeKitchenSink;
  public basicSelectedOption: number = 10;


  //Subprocess progress begin
  public innerPacketProgress: number;
  public innerPacketDescription: string;
  public innerPacking = false;

  public coverProgress: number;
  public coverDescription: string;
  public cover = false;

  public labelProgress: number;
  public labelDescription: string;
  public label = false;

  public outerPackingProgress: number;
  public outerPackingDescription: string;
  public outerPacking = false;

  public newProductProgress: number;
  public newProductDescription: string;
  public newProduct = false;
  //Subprocess progress end

  columns = [{ name: 'Daxili paketləmə', prop: 'innerPackingProgress'}, { name: 'Örtük', prop: 'coverProgress' }
  , { name: 'Etiket',prop: 'labelProgress' }, { name: 'Xarici paketləmə', prop:'outerPackingProgress' }
  , { name: 'Yeni məhsul', prop: 'newProductProgress' }];


  ngOnInit(): void {
    
		this.setSubprocessFilter();
    this.fill();
    this.buildSubprocessColumns();
    //this.loadProjects();
  }
  constructor(private _projectProgressService: ProjectSubprocessProgressService,
    private router: Router,
    private modalService: NgbModal,
    private _coreSidebarService: CoreSidebarService) {
		  this._unsubscribeAll = new Subject();

      this._projectState = new ProjectState();

      this._projectState.filter.status = "0";
    }
  /**
   * Row Details Toggle
   *
   * @param row
   */
  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }

  get state() {
		return this._projectState;
	}

  ngAfterViewChecked() {
    if (this.tableRowDetails && this.tableRowDetails.rowDetail) {
      this.tableRowDetails.isCheck = true;
    }
  }

  filterUpdate(event) {
     const val = event.target.value.toLowerCase();

    this._projectState.searchTerm = val;
    this.fill();
  }

  setPage(page) {
		this._projectState.paginator.page = page.offset+1;

		this.fill();
	}

  setPageSize(size) {
    this._projectState.paginator.size = Number(size);

    this.fill();
  
}

  onSort(sort) {
		this._projectState.sorting.column = sort.column.prop;
		this._projectState.sorting.direction = sort.newValue;

		this.fill();
	}

  loadProjects() {
     this._projectProgressService.getProjects().
     subscribe( (response) => {                           //next() callback
       //this.projects = response;
       this.tempData = response;
     });
     this.fill();
     
  }

  deleteProject(id) {
    Swal.fire({
      title: "Silmək istədiyinizə əminsiniz?",
      text: "Sildikdən sonra geri qaytarmaq mümkün olmayacaq !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Bəli, sil!",
      cancelButtonText: "Xeyr, geri qayıd!",
    }).then((result) => {
      if (result.isConfirmed) {
        this._projectProgressService.deleteProject(id).subscribe((response) => {});
        this.fill();
      }
    });
  }

  addNewProject() {
    this.router.navigate(['/project/add']);
  }


  editProgress(id,progressModal){
    const found = this.tempData.items.find(element => element.id == id);
    this.resetProgress();
    
    if (found !== null && found.subprocessProgresses.length > 0) {
      
    found.subprocessProgresses.forEach(subprocess => {
      
      switch (subprocess.subprocessType){
        case 5:
          if (this._projectProgressService.currentUser.InnerPacking === 'False' 
          && this._projectProgressService.currentUser.Project === 'False')  break;
          
          this.innerPacketProgress = subprocess.progress;
          this.innerPacketDescription = subprocess.description;
          this.innerPacking = true;
          break;
        case 2:
          if (this._projectProgressService.currentUser.Cover === 'False'
          && this._projectProgressService.currentUser.Project === 'False')  break;
          
          this.coverProgress = subprocess.progress;
          this.coverDescription = subprocess.description;
          this.cover = true;
          break;
        case 3:
          if (this._projectProgressService.currentUser.Label === 'False'
          && this._projectProgressService.currentUser.Project === 'False')  break;
         
          this.labelProgress = subprocess.progress;
          this.labelDescription = subprocess.description;
          this.label = true;
          break;
        case 4:
          if (this._projectProgressService.currentUser.OuterPacking === 'False'
          && this._projectProgressService.currentUser.Project === 'False')  break;
          
          this.outerPackingProgress = subprocess.progress;
          this.outerPackingDescription = subprocess.description;
          this.outerPacking = true;
          break;
        case 6:
          if (this._projectProgressService.currentUser.NewProduct === 'False'
          && this._projectProgressService.currentUser.Project === 'False')  break;
          
          this.newProductProgress = subprocess.progress;
          this.newProductDescription = subprocess.description;
          this.newProduct = true;
          break;
      }
    });
    
    //Open modal
    this.modalService.open(progressModal, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).
    result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.updateProgress(found);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    

    //Update changes
    //this._projectService.updateProgress()
  }
  }

  resetProgress() {

    this.innerPacketProgress = 0;
    this.innerPacketDescription = "";
    this.innerPacking = false;

    this.coverProgress = 0;
    this.coverDescription = "";
    this.cover = false;
  
    this.labelProgress = 0;
    this.labelDescription = "";
    this.label = false;
    
    
    this.outerPackingProgress = 0;
    this.outerPackingDescription = "";
    this.outerPacking = false;

    this.newProductProgress = 0;
    this.newProductDescription = "";
    this.newProduct = false;

  }

  updateProgress(found) {
    let subprocessProgressList =  [];
    let progress;
    if (this.innerPacking) {
       progress = found.subprocessProgresses.find(element => element.subprocessType == 5);
       progress.progress = this.innerPacketProgress;
       progress.description = this.innerPacketDescription;  
       subprocessProgressList.push(progress);
    }

    if (this.cover) {
      progress = found.subprocessProgresses.find(element => element.subprocessType == 2);
      progress.progress = this.coverProgress;
      progress.description = this.coverDescription;  
      subprocessProgressList.push(progress);
    }

    if (this.label) {
      progress = found.subprocessProgresses.find(element => element.subprocessType == 3);
      progress.progress = this.labelProgress;
      progress.description = this.labelDescription;  
      subprocessProgressList.push(progress);
    }

  if (this.outerPacking) {
    progress = found.subprocessProgresses.find(element => element.subprocessType == 4);
    progress.progress = this.outerPackingProgress;
    progress.description = this.outerPackingDescription;
    subprocessProgressList.push(progress);
  }

  if (this.newProduct) {
    progress = found.subprocessProgresses.find(element => element.subprocessType == 6);
    progress.progress = this.newProductProgress;
    progress.description = this.newProductDescription;
    subprocessProgressList.push(progress);
  }

  this._projectProgressService.updateProgress(subprocessProgressList).subscribe(data => {
    this.fill();
  });

  }

  public fill() {
		this.loading = true;
		this._projectProgressService.fill(this._projectState).subscribe((data) => {
      this.tempData = data;
			this._projectState.paginator.total = data != null ? data.total : 0;
			this.loading = false;

		});

		this.rows$ = this._projectProgressService.items$;
	}

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  camelCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
  buildSubprocessColumns() {
    let nameOfSubprocess;
    if (this._projectProgressService.currentUser.Project != 'True') {
      this.columns = this.columns.filter(c => {
        nameOfSubprocess = this.camelCase(c.prop.replace("Progress",""));
        
        return this._projectProgressService.currentUser[nameOfSubprocess] == 'True';
      });
    }
  }

  setSubprocessFilter() {
    var subprocess_ = "";
    var subprocess_filter = "";
    if (this._projectProgressService.currentUser.Project != 'True') {
    subprocess_ += (this._projectProgressService.currentUser.InnerPacking === 'True' ? "5" : "")
    subprocess_ += (this._projectProgressService.currentUser.Cover === 'True' ? "2" :"")
    subprocess_ += (this._projectProgressService.currentUser.Label === 'True' ? "3" : "")
    subprocess_ += (this._projectProgressService.currentUser.OuterPacking === 'True' ? "4" : "")
    subprocess_ += (this._projectProgressService.currentUser.NewProduct === 'True' ? "6" : "")
    }
    for (var i = 0; i < subprocess_.length-1; i++) {
      subprocess_filter += subprocess_.charAt(i)+","
    }
    subprocess_filter += subprocess_.charAt(subprocess_.length-1)
    this._projectState.filter.subprocess = subprocess_filter
  }
}
