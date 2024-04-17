import { EventsRequestParamaters } from "../models/ct-rest/events";
import { GroupsRequestFilterOptions, GroupsRequestOptions } from "../models/ct-rest/groups";
import { CtAjaxClient } from "./CtAjaxClient";
import { CtRestClient } from "./CtRestClient";

export class CTClient {

  private readonly token: string;
  private readonly ctUrl: string;

  private restClient: CtRestClient;
  private ajaxClient: CtAjaxClient;

  private _isAuthenticated: Promise<true>;

  public constructor(token: string, ctUrl: string){
    this.token = token;
    this.ctUrl = ctUrl;

    this.restClient = new CtRestClient(this.token, this.ctUrl);

    this.authenticate();
  }

  public async authenticate(){
    this._isAuthenticated = this.restClient.authenticate();

    await this._isAuthenticated;
    
    this.ajaxClient = new CtAjaxClient(this.ctUrl, this.restClient.getCookie(), this.restClient.getCsrfToken());

    return this.isAuthenticated;
  }

  public get isAuthenticated(){
    return this._isAuthenticated;
  }

  public getEvents(parameters?: EventsRequestParamaters){
    return this.restClient.getEvents(parameters);
  }

  public getEvent(eventId: string | number){
    return this.restClient.getEvent(eventId);
  }

  public addEventLink(url: string, linkName: string, eventId: string | number){
    return this.ajaxClient.addLink(url, linkName, eventId);
  }

  public deleteFile(fileId: string | number){
    if(typeof fileId === "string" && !/^\d+$/.test(fileId)) {
      throw new Error(`File id [${fileId}] is not a positive integer!`)
    }

    return this.ajaxClient.deleteFile(fileId);
  }

  public getGroups(options: GroupsRequestOptions = {limit: 200, page: 1}){
    return this.restClient.getGroups(options);
  }
}