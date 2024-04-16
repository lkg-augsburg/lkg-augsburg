import { CsrfTokenRepsone } from "../models/ct-rest/CsrfToken";
import { CtCookie } from "../models/ct-rest/CtCookie";
import { Event, EventsRequestParamaters } from "../models/ct-rest/events";
import { parseSetCookie } from "../utils/parse-set-cookie";

interface ExecOptions {
  headers?: { [headerName: string]: string;};
  method?: string;
  parameters?: {[parameterName: string]: string | number | boolean | string[] | number[] | undefined | null }
}

export class CtRestClient {

  private readonly token: string;
  private readonly ctUrl: string;
  private readonly baseUrl: string;

  private csfrToken: string;
  private cookie: CtCookie;
  
  public constructor(token: string, ctUrl: string){
    this.token = token;
    this.ctUrl = ctUrl;
    this.baseUrl = `${ctUrl.replace(/\/+$/, '')}/api`;
  }

  private async _exec(
    uri: string, 
    {headers, method, parameters}: ExecOptions = {}
){
    let url = `${this.baseUrl}/${uri.replace(/^\/+/, '')}`.replace(/\/+/g, '/');

    if(parameters){
      const paras = [];
      for(const [paraName, paraValue] of Object.entries(parameters)){
        if(paraValue instanceof Array){
          paras.push(`${encodeURIComponent(paraName)}=${encodeURIComponent(paraValue.join(','))}`);
        } else if (paraValue === undefined || paraValue === null){
          paras.push(encodeURIComponent(paraName));
        } else {
          paras.push(`${encodeURIComponent(paraName)}=${encodeURIComponent(paraValue)}`);
        }
      }

      url = `${url}?${paras.join('&')}`
    }

    const reqHeaders = {
      'Authorization': `Login ${this.token}`,
      'Content-Type': 'application/json; charset=utf-8',
      ...headers
    };
    const resp = await fetch(url, {
      method: method === undefined ? 'GET': method,
      headers: reqHeaders,
    });

    return resp
  }

  private async _execJson<T>(
    uri: string, 
    options?: ExecOptions
  ){
    return (await this._exec(uri, options)).json() as Promise<T>
  }

  async authenticate(): Promise<true> {
    const resp = await this._exec('csrftoken');
    const loginCookie = resp.headers.getSetCookie().find(sc => sc.startsWith('ChurchTools_ct_'));
    const ctCookie = parseSetCookie(loginCookie);
    const {data: csrfToken} = (await resp.json()) as CsrfTokenRepsone;

    this.csfrToken = csrfToken;
    this.cookie = ctCookie;

    return true;
  }

  public async refreshCsrfToken() {
    const {data: csrfToken} = await this._execJson<CsrfTokenRepsone>('csrftoken');
    this.csfrToken = csrfToken;
  }

  getCsrfToken(){
    return `${this.csfrToken}`;
  }

  getCookie(){
    return {...this.cookie};
  }

  getEvents(parameters?: EventsRequestParamaters){
    const paras = {...parameters};
    if(paras.direction === undefined) {
      paras.direction = "forward";
    }
    return this._execJson<{
      data: Event[],
      meta: { count: number; }
    }>('/events', {parameters: {...paras}});
  }

  getEvent(eventId: number | string){
    return this._execJson<{ data: Event }>(`/events/${eventId}`)
  }
}