export class ProjectAdd {
  id?:number;
  name?: string;
  target?: string;
  owner?: string;
  argeOwner?: string;
  itemGroupID?: number;
  itemCode?: string;
  brandID?: number;
  subBrandID?: string;
  itemName?: string;
  itemPrice?: number;
  profitability?: number;
  estimatedSalesTurnover?: number;
  incrementalTurnover?: number;
  marketResearch?: boolean;
  marketResearchDescription?: string;
  investment?: boolean;
  investmentDescription?: string;
  statusID?: number;
  categoryID?: string;
  saleChannelID?: number;
  riskRatingID?: number;
  riskRatingDescription?: string;
  filePath?: "";
  deactivated?: boolean = false;
  userID?:number;
  projectSubProcess: { subprocesses: any };

  constructor() {}

  public fillProjectWithFCG(formControlGroup) {
    for (var item in formControlGroup)
      for (var subItem in formControlGroup[item])
        this[subItem]= formControlGroup[item][subItem];
  }
}
