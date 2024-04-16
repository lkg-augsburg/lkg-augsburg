import { CtRestClient } from "./CtRestClient";

export class CTClient {

  private readonly token: string;
  private readonly ctUrl: string;

  private restClient: CtRestClient;

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
    

    return this.isAuthenticated;
  }

  public get isAuthenticated(){
    return this._isAuthenticated;
  }

}