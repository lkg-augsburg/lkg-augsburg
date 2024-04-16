export interface CtCookie {
  name: string;
  value: string;
  domain: string | null;
  expires: string | null;
  httpOnly: boolean;
  maxAge: string | null;
  partitioned: boolean;
  path: string | null;
  secure: boolean;
  sameSite: string | null;
  otherFlags: {
    [otherFlagKey: string]: string | boolean;
  }
}