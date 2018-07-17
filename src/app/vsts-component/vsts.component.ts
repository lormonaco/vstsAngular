import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WorkItemService } from '../service/workItem.service';


@Component({
    selector: 'app-vsts',
    //template: '<h2>Report VSTS</h2>',
    templateUrl: '../view/work_items.html',
    providers: [WorkItemService],

    

})

export class VstsComp implements OnInit {
    public workItems: any = [];
    constructor(private _vsts: WorkItemService) {

    }

    getWorkItemsFromMock() {
        this.workItems = this._vsts.getWorkItems(true);
        console.log(this.workItems);
    }


    ngOnInit() {
        this.getWorkItemsFromMock();
    }
}