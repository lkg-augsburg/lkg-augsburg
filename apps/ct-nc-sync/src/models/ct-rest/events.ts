export interface EventsRequestParamaters { 
  from?: string; 
  to?: string; 
  canceled?: boolean; 
  direction?: "forward" | "backward"; 
  page?: number; 
  limit?: number; 
  include?: "eventServices" 
}

export interface EventFile {
  title: string;
  domainType: "file" | "link";
  domainIdentifier: string;
  apiUrl: string;
  frontendUrl: string;
  imageUrl: string | null;
  icon: string;
  domainAttributes: { [key: string]: unknown; };
  infos: unknown[]
}

export interface EventCalendar {
  title: string;
  domainType: string;
  domainIdentifier: string;
  apiUrl: string;
  frontendUrl: string;
  imageUrl: string;
  icon: string;
  domainAttributes: { campusName: string; };
  infos: []
}

export interface Event {
  id: number;
  guid: string;
  name: string;
  note: string | null;
  appointmentId: number;
  startDate: string;
  endDate: string;
  chatStatus: string | "STARTED" | "STOPPED" | "NOT_STARTED";
  isCanceled: boolean;
  adminIds: number[];
  "@deprecated": string;
  description: string | null;
  eventAdminIds: number[];
  permissions: {
      useChat: boolean;
      startChat: boolean;
  };
  calendar: EventCalendar;
  eventFiles: EventFile[];
}
