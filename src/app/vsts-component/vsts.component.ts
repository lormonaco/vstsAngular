import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WorkItemService } from '../service/workItem.service';
import { IWorkItem } from '../shared/interface/workitem.interface';
import { commons, EffortCriticity } from '../shared/commons';

@Component({
    selector: 'app-vsts',
    templateUrl: '../view/work_items.html',
    providers: [WorkItemService],



})
export class VstsComp implements OnInit, OnDestroy {
    idList: any = [];
    workItems: IWorkItem[] = [];
    private vstsConnection: any;
    private wiConnection: any;
    constructor(private _vsts: WorkItemService) { }




    ngOnInit() {

        this.vstsConnection = this._vsts.getWorkItemsFromVSTS().subscribe(data => {
            this.idList = data['workItems'];
            this.idList.map((wi) => {

                this.wiConnection = this._vsts.getWorkItemByUrl(wi['url']).subscribe((result) => {

                    let tempWi: IWorkItem = {};
                    tempWi.id = result['id'];
                    tempWi.title = result['fields']['System.Title'];
                    tempWi.version = result['fields']['System.IterationPath'].substring(32);
                    tempWi.originalEstimate = result['fields']['Microsoft.VSTS.Scheduling.OriginalEstimate'];
                    tempWi.completed = result['fields']['Microsoft.VSTS.Scheduling.CompletedWork'];
                    tempWi.assignedTo = result['fields']['System.AssignedTo']
                    // if the completed requires more than 2 times of the original effort, the status is critical
                    tempWi.critical = tempWi.originalEstimate < tempWi.completed / 2 ? EffortCriticity.Danger.toString() : tempWi.originalEstimate < tempWi.completed ? EffortCriticity.Warning : EffortCriticity.Success.toString();
                    this.workItems.push(tempWi);
                });
            })
        })
    }

    ngOnDestroy() {
        this.vstsConnection.unsubscribe();
        this.wiConnection.unsubscribe();
    }
}