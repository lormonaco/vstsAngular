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
     dashboardTypeValue: any = "---";
     selectedCritical:any = "---";

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
               
                var one_day=1000*60*60*24;
                var one_hour=1000*60*60;
                this.wiConnection = this._vsts.getWorkItemByUrl(wi['url']).subscribe((result) => {

                    let tempWi: IWorkItem = {};
                   
                    tempWi.id = result['id'];
                    tempWi.title = result['fields']['System.Title'];
                    tempWi.version = result['fields']['System.IterationPath'].substring(32);
                    tempWi.originalEstimate = result['fields']['Microsoft.VSTS.Scheduling.OriginalEstimate'];
                    tempWi.completed = result['fields']['Microsoft.VSTS.Scheduling.CompletedWork'];
                    tempWi.assignedTo = result['fields']['System.AssignedTo']['displayName'];
                    tempWi.remainingWork = result['fields']['Microsoft.VSTS.Scheduling.RemainingWork'];
                    tempWi.developmentStart = result['fields']['Custom.DevelopmentTimeTracker'].substring(0,16);
                    if(!result['fields']['Custom.DevelopmentTimeTrackerEnd'] ){
                        tempWi.developmentEnd = "";
                    }
                    else {tempWi.developmentEnd = result['fields']['Custom.DevelopmentTimeTrackerEnd'].substring(0,16); }
                    tempWi.netDevTime = result['fields']['Microsoft.VSTS.Scheduling.CompletedWork'];
                    tempWi.netEstimationDelta = tempWi.originalEstimate-tempWi.completed;

                    var devStartTime = new Date(tempWi.developmentStart);
                    var devEndTime =  !tempWi.developmentEnd ? new Date() :   new Date(tempWi.developmentEnd);
                    
                    tempWi.grossDevTime= Math.round((devEndTime.getTime()-devStartTime.getTime())/one_hour);

                    


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

    onChange(criticalFilter) {
        this.dashboardTypeValue = criticalFilter;
        var selectedCriticalvalue = this.selectedCritical; 
        this.workItems = this.allWorkItems;
        

        
      

        if(this.dashboardTypeValue == "monitor"){
                console.log();
                var newResult = this.workItems.filter(function (el) {
                    return el.critical == criticalFilter && el.remainingWork > 0  ; 
                });
            }

            if(this.dashboardTypeValue == "report"){
              
                var newResult = this.workItems.filter(function (el) {
                    return el.critical == criticalFilter && el.remainingWork == 0  ; 
                });
            }
            else {
                var newResult = this.workItems.filter(function (el) {
                
                    return el.critical == criticalFilter  ;
                });
            }
            
            
            
            this.workItems = newResult;
        
    }

    onDashboardTypeChange(newValue) {
        
        this.dashboardTypeValue = newValue;
        var selectedCriticalvalue = this.selectedCritical; 
        this.workItems = this.allWorkItems;
       
        
        if (newValue == "monitor") {
            
            var newResult = this.workItems.filter(function (el) {
                return selectedCriticalvalue !="---" ?  (el.remainingWork > 0 && el.critical == selectedCriticalvalue):el.remainingWork>0;
            })
            
            this.workItems = newResult;
        }
        else if (newValue == "report") {
         
            var newResult = this.workItems.filter(function (el) {
                return selectedCriticalvalue !="---" ?  (el.remainingWork == 0 && el.critical == selectedCriticalvalue) : el.remainingWork == 0;
            })
            this.workItems = newResult;
        }
        else {
            
            var newResult = this.workItems.filter(function (el) {
                return selectedCriticalvalue !="---" ?  ( el.critical == selectedCriticalvalue) : this.workItems ;
            })
            this.workItems = newResult;
            
        }

    }

    resetFilter() {
        
        this.workItems = this.allWorkItems;
        this.selectedCritical = "---";
        this.dashboardTypeValue = "---";
    }

}