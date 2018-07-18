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

    getWorkItemsFromVSTS() {

        console.log("OK");
        return this.http.get("https://aptargmesprod.visualstudio.com/GMES-Productivity/_apis/wit/wiql/{63957efc-319c-447d-97c4-c3b15987eafa}?api-version=4.1", { headers: { 'Authorization': this.getAuth(commons.PAT) } })

    }

    getWorkItemByUrl(url){
        return this.http.get(url, { headers: { 'Authorization': this.getAuth(commons.PAT) } })

    }

    /* build access token */
    private getAuth(pat: any) {
        return 'Basic ' + btoa('' + ':' + pat);
    }





}