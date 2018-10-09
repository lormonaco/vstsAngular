import { Component, OnInit, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WorkItemService } from '../service/workItem.service';
import { IWorkItem } from '../shared/interface/workitem.interface';
import { commons, EffortCriticity } from '../shared/commons';
import { bind } from '@angular/core/src/render3/instructions';

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
    private dashboardTypeValue: any = "---";
    private selectedCritical:any = "---";

    getSelectedCritical(){
        return this.selectedCritical;
    }

    getdashboardTypeValue(){
        return this.dashboardTypeValue;
    }

    ngOnInit() {

        this.vstsConnection = this._vsts.callQueryEffortsDashboard().subscribe(data => {
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
                    tempWi.remainingWork = result['fields']['Microsoft.VSTS.Scheduling.RemainingWork'];

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

        this.workItems.sort((obj1, obj2) => obj1.id > obj2.id ? 1 : obj1.id == obj2.id ? 0 : -1);


        this.allWorkItems = this.workItems;
    }

    ngOnDestroy() {
        this.vstsConnection.unsubscribe();
        this.wiConnection.unsubscribe();
    }

    onChange(newValue) {
        this.selectedCritical = newValue;
        console.log("dashboard type is "+ this.dashboardTypeValue);
        console.log("selected critical is "+ this.selectedCritical);
        
        this.workItems = this.allWorkItems;
        
        
        
        if (newValue == "---") {
            this.workItems = this.allWorkItems;
        } else {

            if(this.dashboardTypeValue == "monitor"){
                var newResult = this.workItems.filter(function (el) {
                    return el.critical == newValue && el.remainingWork > 0  ; 
                });
            }

            if(this.dashboardTypeValue == "report"){
                var newResult = this.workItems.filter(function (el) {
                    return el.critical == newValue && el.remainingWork == 0  ; 
                });
            }
            else {
                var newResult = this.workItems.filter(function (el) {
                    return el.critical == newValue  ;
                });
            }
            
            
            
            this.workItems = newResult;
        }
    }

    onDashboardTypeChange(newValue) {
        
        this.dashboardTypeValue = newValue;
        console.log("dashboard type is "+ this.dashboardTypeValue);
        console.log("selected critical is "+ this.selectedCritical);
        var selectedCriticalvalue = this.selectedCritical; 
        this.workItems = this.allWorkItems;
       

        
        
        if (newValue == "monitor") {
            var newResult = this.workItems.filter(function (el) {
                
                return (el.remainingWork > 0 && el.critical == selectedCriticalvalue);
            })
            this.workItems = newResult;
        }
        else if (newValue == "report") {
            var newResult = this.workItems.filter(function (el) {
               
                return (el.remainingWork == 0 && el.critical == selectedCriticalvalue);
            })
            this.workItems = newResult;
        }
        else {
            this.workItems = this.allWorkItems;
        }

    }

    resetFilter() {
        
        this.workItems = this.allWorkItems;
        this.selectedCritical = "---";
        this.dashboardTypeValue = "---";
    }

}