import { CsrfTokenRepsone } from "../models/ct-rest/csrf-token";
import { CtCookie } from "../models/ct-rest/ct-cookie";
import { Event, EventsRequestParamaters } from "../models/ct-rest/events";
import { Group, GroupsRequestOptions, GroupsResponse } from "../models/ct-rest/groups";
import { parseSetCookie } from "../utils/parse-set-cookie";

interface RequestParameters {
  [parameterName: string]: string | number | boolean | string[] | number[] | undefined | null;
}

interface ExecOptions {
  headers?: { [headerName: string]: string;};
  method?: string;
  parameters?: RequestParameters,
  parameterExplicitArray?: boolean;
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
    {headers, method, parameters, parameterExplicitArray}: ExecOptions = {}
){
    let url = `${this.baseUrl}/${uri.replace(/^\/+/, '')}`.replace(/\/+/g, '/');

    if(parameters){
      const paras = [];
      for(const [paraName, paraValue] of Object.entries(parameters)){
        if(paraValue instanceof Array){
          const encParaName = encodeURIComponent(paraName);
          if(parameterExplicitArray){
            paras.push(...paraValue.map(v => `${encodeURIComponent(`${encParaName}[]`)}=${encodeURIComponent(v)}`));
          } else {
            paras.push(`${encParaName}=${encodeURIComponent(paraValue.join(','))}`);
          }
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

  public async getGroups(options: GroupsRequestOptions = {limit: 200, page: 1}){
    const groups: Group[] = [];
    const isParameterExplicitArray = options.includeHasPermission || options.includeMemberStatistics || options.includePlaces || options.includeRoles || options.includeTags || options.filter?.tags !== undefined;
    let hasNextPage = false;
    let nextPage = options.page || 1;
    const baseParameter: RequestParameters = {
      limit: options.limit || 200,
      page: nextPage
    };

    if(baseParameter.page as number < 1){
      baseParameter.page = 1;
    }
    if(baseParameter.limit as number < 1){
      baseParameter.limit = 1;
    }
    if(baseParameter.limit as number > 200){
      baseParameter.limit = 200;
    }

    if(isParameterExplicitArray){
      baseParameter.include = [] as string[]
    }

    if(options.filter?.tags || options.includeTags){
      (baseParameter.include as string[]).push("tags");
    }
    if(options.includeHasPermission){
      (baseParameter.include as string[]).push("hasPermissions");
    }
    if(options.includeMemberStatistics){
      (baseParameter.include as string[]).push("memberStatistics");
    }
    if(options.includePlaces){
      (baseParameter.include as string[]).push("places");
    }
    if(options.includeRoles){
      (baseParameter.include as string[]).push("roles");
    }

    do {
      const parameters = {
        ...baseParameter,
        page: nextPage
      };

      const { data, meta } = await this._execJson<GroupsResponse>('/groups', {
        parameterExplicitArray: isParameterExplicitArray,
        parameters
      });

      if(options.filter){
        const { tags } = options.filter;
        groups.push(...data.filter(({tags: groupTags}) => {
          const groupTagNames = groupTags.map(gt => gt.name);
          for(const gtName of groupTagNames){
            if(tags.includes(gtName)){
              return true;
            }
          }
          return false;
        }));
      } else {
        groups.push(...data)
      }

      hasNextPage = meta.pagination.current < meta.pagination.lastPage;
      nextPage = meta.pagination.current + 1;
    } while (hasNextPage);

    return groups;
  }
}