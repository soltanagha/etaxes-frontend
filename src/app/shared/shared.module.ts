import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { CardSnippetModule } from "@core/components/card-snippet/card-snippet.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { BrandService } from "./brand.service";
import { CategoryService } from "./category.service";
import { ItemGroupService } from "./item-group.service";
import { ProjectService } from "./project.service";
import { RiskRatingService } from "./risk-rating.service";
import { SaleChannelService } from "./sale-channel.service";
import { StatusService } from "./status.service";
import { SubBrandService } from "./subBrand.service";

@NgModule({
  imports: [
    ContentHeaderModule,
    CoreCommonModule,
    NgxDatatableModule,
    CardSnippetModule,
    CoreSidebarModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    CommonModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
  ],
  exports: [
    ContentHeaderModule,
    CoreCommonModule,
    NgxDatatableModule,
    CardSnippetModule,
    CoreSidebarModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    ProjectService,
    StatusService,
    BrandService,
    SubBrandService,
    CategoryService,
    RiskRatingService,
    StatusService,
    SaleChannelService,
    ItemGroupService
  ],
})
export class SharedModule {}
