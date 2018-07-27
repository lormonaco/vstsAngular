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
    allWorkItems: IWorkItem[] = [];




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

                    if (tempWi.originalEstimate < tempWi.completed / 2)
                        tempWi.critical = EffortCriticity.exOptimistic;
                    else if (tempWi.completed < tempWi.originalEstimate / 2)
                        tempWi.critical = EffortCriticity.exPessimistic;
                    else if (tempWi.originalEstimate < tempWi.completed)
                        tempWi.critical = EffortCriticity.notCorrect;
                    else tempWi.critical = EffortCriticity.correct;

                    this.workItems.push(tempWi);
                });
            })
        })

        this.allWorkItems = this.workItems;
    }

    ngOnDestroy() {
        this.vstsConnection.unsubscribe();
        this.wiConnection.unsubscribe();
    }

    onChange(newValue) {
        this.workItems = this.allWorkItems;
        console.log(newValue);
        if (newValue == "---") {
            this.workItems = this.allWorkItems;
        } else { 
        var newResult = this.workItems.filter(function (el) {
            return el.critical == newValue;
        });
        console.log(newValue);
        //  console.log(newResult);
        this.workItems = newResult;
    }
}
}