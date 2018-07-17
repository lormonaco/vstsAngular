import { Injectable } from '@angular/core';
import { WORKITEMS } from './mock.vsts';

@Injectable()

export class WorkItemService {

    /* if simulate, returns the mock data
    otherwise, connect to VSTS */
    getWorkItems(simulate) {
      if(simulate)
        return WORKITEMS;
    }

}