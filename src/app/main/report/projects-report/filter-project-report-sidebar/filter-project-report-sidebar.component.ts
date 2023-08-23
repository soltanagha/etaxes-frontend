import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ProjectState } from 'app/main/project/project-state.model';
import { CategoryService } from 'app/shared/category.service';
import { StatusService } from 'app/shared/status.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filter-project-report-sidebar',
  templateUrl: './filter-project-report-sidebar.component.html'
})
export class FilterProjectReportSidebarComponent implements OnInit {
  public projectOwner;
  public brand;
  public subBrand;
  public itemName;
  public itemPrice;
  public category;
  public status;
  categorySelect$: Observable<any>;
  statusSelect$: Observable<any>;

  public TDCategorySelectVar;
  public TDStatusSelectVar;
  @Output("fill") fill: EventEmitter<any> = new EventEmitter();
  @Input('_projectState') _projectState: ProjectState;
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
      private _categoryService: CategoryService,
      private _statusService: StatusService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    //if (form.valid) {
      this.toggleSidebar('filter-project-report');
    //}
    this.setFilters();
    this.fill.emit();
  }

  loadSelect() {
    this.categorySelect$ = this._categoryService.getSAP();
    this.statusSelect$ = this._statusService.get();
  }

  setFilters() {
      this._projectState.filter['NPTP.PRJ_ARGE_OWNER']=(this.projectOwner == undefined ? "" : " LIKE '%"+this.projectOwner+"%'");
   
      this._projectState.filter['marka_adi'] = (this.brand == undefined ? "" : " LIKE '%"+this.brand+"%'");

      this._projectState.filter['NPTSB.NAME'] = (this.subBrand == undefined ? "" : " LIKE '%"+this.subBrand+"%'");

      this._projectState.filter['PRJ_ITEM_NAME'] = (this.itemName == undefined ? "" : " LIKE '%"+this.itemName+"%'");
      
      this._projectState.filter['PRJ_ITEM_PRICE'] = (this.itemPrice == undefined ? "" : " > "+this.itemPrice);
      this._projectState.filter['NPTC.CODE'] = (this.TDCategorySelectVar == undefined ? "" : " = '"+this.TDCategorySelectVar+"'");
      this._projectState.filter['NPTS.ID'] = (this.TDStatusSelectVar == undefined ? "" : " = '"+this.TDStatusSelectVar+"'");
    }

  ngOnInit(): void {
    this.loadSelect();
  }
}
