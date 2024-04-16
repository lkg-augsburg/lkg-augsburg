export interface EventAddLinkResponse {
  status: "success" | "fail" ;
  data: number | string;
}

export interface EventDeleteFileResponse {
  status: "success" | "fail";
  data: string | null;
}