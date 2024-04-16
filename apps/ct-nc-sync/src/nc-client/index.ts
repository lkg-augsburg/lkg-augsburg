import { convert } from 'xmlbuilder2'
import { NextcloudDirList } from '../models/nextcloud';
import { convertNcDirList } from '../utils/convert-nc-dir-list';

export class NextcloudClient {
  private readonly user: string;
  private readonly pw: string;
  private readonly ncUrl: string;
  private readonly authBase64: string;
  private readonly baseUrl: string;

  public constructor(user: string, pw: string, ncUrl: string){
    this.user = user;
    this.pw = pw;
    this.ncUrl = ncUrl;
    this.authBase64 = `Basic ${Buffer.from(`${user}:${pw}`).toString('base64')}`;
    this.baseUrl = `${ncUrl.replace(/\/+$/, '')}/remote.php/dav/files/${user}`;
  }

  private async _exec(uri: string, {headers, method}: {
    headers?: { [headerName: string]: string;},
    method: string
  }){
    const url = `${this.baseUrl}/${uri.replace(/^\/+/, '')}`.replace(/\/+/g, '/');
    const reqHeaders = {
      'Authorization': 'Basic ' + Buffer.from(process.env.NEXTCLOUD_USERNAME + ':' + process.env.NEXTCLOUD_PASSWORD).toString('base64'),
      'Content-Type': 'application/xml; charset=utf-8',
      ...headers
    };
    return await fetch(url, {
      method,
      headers: reqHeaders,
    });
  }

  async readDir(dir = ''){
    const response = await this._exec(dir, {
      headers: {
        'Depth': '1'
      },
      method: 'PROPFIND'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    const respData = convert(data, {format: 'object'}) as unknown as NextcloudDirList;

    return convertNcDirList(respData);
  }
}