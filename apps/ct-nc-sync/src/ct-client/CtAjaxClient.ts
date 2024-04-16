import { CtCookie } from "../models/ct-rest/ct-cookie";
import { EventAddLinkResponse, EventDeleteFileResponse } from "../models/ct-ajax/events";

export class CtAjaxClient {

  private readonly ctUrl: string;
  private readonly baseUrl: string;
  private readonly cookie: CtCookie;
  private readonly csfrToken: string;

  public constructor(ctUrl: string, cookie: CtCookie, csfrToken: string){
    this.ctUrl = ctUrl;
    this.baseUrl = `${ctUrl.replace(/\/+$/, '')}/index.php?q=churchservice/ajax`;
    this.cookie = cookie;
    this.csfrToken = csfrToken;
  }

  private async _exec(paras: {[key: string]: string}){
    const reqHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cookie': `${this.cookie.name}=${this.cookie.value}`,
      'csrf-token': this.csfrToken,
    };

    const body = [...Object.entries(paras)].map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');

    const resp = await fetch(this.baseUrl, {
      headers: reqHeaders,
      method: 'POST',
      body
    })

    return resp;
  }

  private async _execJson<T>(formData){
    return (await this._exec(formData)).json() as T;
  }

  public addLink(url: string, linkName: string, eventId: string |number){
    const formData = {
      url: url,
      name: linkName,
      func: 'uploadLink',
      domain_id: `${eventId}`,
      domain_type: 'service',
    }

    return this._execJson<EventAddLinkResponse>(formData);
  }
  public deleteFile(fileId: string | number){
    return this._execJson<EventDeleteFileResponse>({
      func: 'delFile',
      id: fileId
    })
  }
}