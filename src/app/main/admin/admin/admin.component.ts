import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { Observable, Subject } from 'rxjs';
import * as snippet from "app/main/project/project-list/datatables.snippetcode";
import { AdminService } from './admin.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {

  private _unsubscribeAll: Subject<any>;
  private tempData = [];


  public rows$: Observable<any>;
	public rows: any;
  public searchValue = "";
	public loading: boolean = true;
  // snippet code variables
  public _snippetCodeKitchenSink = snippet.snippetCodeKitchenSink;
  public _snippetCodeInlineEditing = snippet.snippetCodeInlineEditing;
  public _snippetCodeRowDetails = snippet.snippetCodeRowDetails;
  public _snippetCodeCustomCheckbox = snippet.snippetCodeCustomCheckbox;
  public _snippetCodeResponsive = snippet.snippetCodeResponsive;
  public _snippetCodeMultilangual = snippet.snippetCodeMultilangual;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;


  public contentHeader: object;
  public expanded = {};
  public ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  projects$: Observable<any>;
  public basicSelectedOption: number = 10;

  public kitchenSinkRows: any;

  constructor(private _adminService: AdminService,
    private router: Router,) { 
      this._unsubscribeAll = new Subject();
    }

  /**
   * On init
   */
  ngOnInit() {
    this._adminService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
    });
    
  }

  addNewUserRole() {
    this.router.navigate(['/admin/add-user-role']);
  }

  editUserRoles(id) {
    this.router.navigate(['/admin/edit-user-role/'+id]);
  }
}
