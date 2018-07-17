import { Injectable } from '@angular/core';
import { WORKITEMS } from './mock.vsts';

@Injectable()

export class WorkItemService {

    getWorkItems() {
        return WORKITEMS;
    }

}