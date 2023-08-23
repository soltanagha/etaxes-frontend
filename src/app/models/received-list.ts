import { Received } from "./received";

export class ReceivedList { 
    items: Received[];

    public fillProjectWithFCG(formControlGroup) {
        for (var item in formControlGroup)
          for (var subItem in formControlGroup[item])
            this[subItem]= formControlGroup[item][subItem];
      }
}