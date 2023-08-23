import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  ColumnMode,
  SelectionType,
} from "@swimlane/ngx-datatable";
import * as snippet from "app/main/project/project-list/datatables.snippetcode";
import { ProjectReportService } from "././project-report.service";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { ProjectState } from "../../project/project-state.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import {Report} from "../report.model";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-projects-report',
  templateUrl: './projects-report.component.html',
  styleUrls: ['./projects-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectsReportComponent implements OnInit {

// Private
private _unsubscribeAll: Subject<any>;
private tempData = [];
public rows$: Observable<any>;
public rows: any;
public searchValue = "";
public _projectState: ProjectState = new ProjectState();
public loading: boolean = true;

@ViewChild("tableRowDetails") tableRowDetails: any;
public contentHeader: object;
public expanded = {};
public ColumnMode = ColumnMode;
SelectionType = SelectionType;
public _snippetCodeKitchenSink = snippet.snippetCodeKitchenSink;
public basicSelectedOption: number = 10;

 //Subprocess progress begin
 public innerPacketID: number;
 public innerPacketProgress: number;
 public innerPacketDescription: string;
 public innerPacking = false;

 public coverID: number;
 public coverProgress: number;
 public coverDescription: string;
 public cover = false;

 public labelID: number;
 public labelProgress: number;
 public labelDescription: string;
 public label = false;

 public outerPackingID: number;
 public outerPackingProgress: number;
 public outerPackingDescription: string;
 public outerPacking = false;

 public newProductID: number;
 public newProductProgress: number;
 public newProductDescription: string;
 public newProduct = false;
 //Subprocess progress end

  selectedSubprocess: string = '';
  subprocessHistory: Report[];

ngOnInit(): void {
  this.setSubprocessFilter();
  this.fill();
  
  //this.loadProjects();
}
constructor(private _projectService: ProjectReportService,
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

toggleSidebar(name): void {
  this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
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
   this._projectService.getProjects().
   subscribe( (response) => {                           //next() callback
     //this.projects = response;
     this.tempData = response;
   });
   this.fill();
   
}

openSubprocessProgress(id,progressModal){
  this._projectService.GetProgressByID(id).subscribe(data => {
    if (data.length > 0) {
      this.fillSubprocessProgress(data);
      this.modalService.open(progressModal, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).
          result.then((result) => {
        //this.updateProgress(data);
      }, (reason) => {
        // console.log("reason:",reason);
      });
    }
    this.fill();
  });
}

  onSubprocessProgressHistory(id,modal,name){
    this.selectedSubprocess = "Alt prosess";
    this._projectService.GetProgressHistoryBySubprocessID(id).pipe(
        map((subprocessProgress: Report[]) => subprocessProgress
            .map(item => {
                item.name = name;
                return item;
            }))
    ).subscribe(data => {
    this.subprocessHistory = data;
       if (data.length > 0) {
         //this.fillSubprocessProgress(data);
         this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg'}).
         result.then((result) => {
           //this.updateProgress(data);
         }, (reason) => {
           // console.log("reason:",reason);
         });
       }
    });
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

this._projectService.updateProgress(subprocessProgressList).subscribe(data => {
  this.fill();
});

}

fillSubprocessProgress(progresses){
  
  progresses.forEach(subprocess => {
    switch (subprocess.subprocessType){
      case 5:
        this.innerPacketID = subprocess.subprocessID;
        this.innerPacketProgress = subprocess.progress;
        this.innerPacketDescription = subprocess.description;
        this.innerPacking = true;
        break;
      case 2:
        this.coverID = subprocess.subprocessID;
        this.coverProgress = subprocess.progress;
        this.coverDescription = subprocess.description;
        this.cover = true;
        break;
      case 3:
        this.labelID = subprocess.subprocessID;
        this.labelProgress = subprocess.progress;
        this.labelDescription = subprocess.description;
        this.label = true;
        break;
      case 4:
        this.outerPackingID = subprocess.subprocessID;
        this.outerPackingProgress = subprocess.progress;
        this.outerPackingDescription = subprocess.description;
        this.outerPacking = true;
        break;
      case 6:
        this.newProductID = subprocess.subprocessID;
        this.newProductProgress = subprocess.progress;
        this.newProductDescription = subprocess.description;
        this.newProduct = true;
        break;
    }
  });

 
}

setSubprocessFilter() {
  var subprocess_ = "";
  var subprocess_filter = "";
  if (this._projectService.currentUser.Project != 'True') {
    subprocess_ += (this._projectService.currentUser.Cover === 'True' ? "2" :"")
    subprocess_ += (this._projectService.currentUser.Label === 'True' ? "3" : "")
    subprocess_ += (this._projectService.currentUser.OuterPacking === 'True' ? "4" : "")
    subprocess_ += (this._projectService.currentUser.InnerPacking === 'True' ? "5" : "")
    subprocess_ += (this._projectService.currentUser.NewProduct === 'True' ? "6" : "")
  }
  for (var i = 0; i < subprocess_.length-1; i++) {
    subprocess_filter += subprocess_.charAt(i)+","
  }
  subprocess_filter += subprocess_.charAt(subprocess_.length-1)
  this._projectState.filter.subprocess = subprocess_filter
}

public fill() {
  this.loading = true;
  this._projectService.fill(this._projectState).subscribe((data) => {
    this._projectState.paginator.total = data != null ? data.total : 0;
    this.loading = false;
  });

  this.rows$ = this._projectService.items$;
}

}
