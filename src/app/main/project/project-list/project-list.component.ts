import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  ColumnMode,
  SelectionType,
} from "@swimlane/ngx-datatable";
import * as snippet from "app/main/project/project-list/datatables.snippetcode";
import { ProjectListService } from "./project-list.service";
import { Observable, Subject } from "rxjs";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ProjectState } from "../project-state.model";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

@Component({
  selector: "app-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectListComponent implements OnInit {
  // Private
  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  public rows$: Observable<any>;
	public rows: any;
  public searchValue = "";
  public _projectState: ProjectState = new ProjectState();
	public loading: boolean = true;
  public addProject = true;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  public contentHeader: object;
  public ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  public _snippetCodeKitchenSink = snippet.snippetCodeKitchenSink;
  public basicSelectedOption: number = 10;


  ngOnInit(): void {
    this.setSubprocessFilter();
		this.fill();
    this.addProject = this._projectService.currentUser.Project == "False";

  }
  constructor(
    private _projectService: ProjectListService,
    private router: Router,
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
    //  // filter our data
    //  const temp = this.tempData.filter(function (d) {
    //    return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    //  });
    // // // update the rows
    // this.tableRowDetails = temp;
    // // // Whenever the filter changes, always go back to the first page
    // this.tableRowDetails.offset = 0;

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
        this._projectService.deleteProject(id).subscribe((response) => {});
        this.fill();
      }
    });
  }

  addNewProject() {
    this.router.navigate(['/project/add']);
  }
  
  editProject(id){
    this.router.navigate(['/project/edit/'+id]);
  }

  setSubprocessFilter() {
    var subprocess_ = "";
    var subprocess_filter = "";
    if (this._projectService.currentUser.Project != 'True') {
      subprocess_ += (this._projectService.currentUser.InnerPacking === 'True' ? "5" : "")
      subprocess_ += (this._projectService.currentUser.Cover === 'True' ? "2" :"")
      subprocess_ += (this._projectService.currentUser.Label === 'True' ? "3" : "")
      subprocess_ += (this._projectService.currentUser.OuterPacking === 'True' ? "4" : "")
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
