import { Injectable } from '@angular/core';
import { WORKITEMS } from './mock.vsts';
import { HttpClient } from '@angular/common/http';
import { commons } from '../shared/commons'

@Injectable()

export class WorkItemService {

    constructor(private http: HttpClient) {

    }

    /* if simulate, returns the mock data
    otherwise, connect to VSTS */
    getWorkItemsFromMock() {

        return WORKITEMS;

    }

    callQueryEffortsDashboard() {
        // call query SharedQuery/Troubleshooting/efforts dashboard
        //return this.http.get("https://aptargmesprod.visualstudio.com/GMES-Productivity/_apis/wit/wiql/{63957efc-319c-447d-97c4-c3b15987eafa}?api-version=4.1", { headers: { 'Authorization': this.getAuth(commons.PAT) } })
        // 9956323f-47ed-4a15-9b5a-fbffdf1c1b6b
        console.log("*test*");
        return this.http.get("https://aptargmesprod.visualstudio.com/GMES-Productivity/_apis/wit/wiql/{9956323f-47ed-4a15-9b5a-fbffdf1c1b6b}?api-version=4.1", { headers: { 'Authorization': this.getAuth(commons.PAT) } })
        
    }

    getWorkItemByUrl(url){
        console.log(url);
       return this.http.get(url+"?fields=System.Title,System.IterationPath,Microsoft.VSTS.Scheduling.OriginalEstimate,System.AssignedTo,Microsoft.VSTS.Scheduling.CompletedWork,Microsoft.VSTS.Scheduling.RemainingWork,Custom.DevelopmentTimeTracker,Custom.DevelopmentTimeTrackerEnd", { headers: { 'Authorization': this.getAuth(commons.PAT) } })

    }

    /* build access token */
    private getAuth(pat: any) {
        return 'Basic ' + btoa('' + ':' + pat);
    }





}