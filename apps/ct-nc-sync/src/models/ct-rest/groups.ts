import { Tag } from "./tags";

export interface GroupsRequestFilterOptions {
  tags: string[]
}

export interface GroupsRequestOptions {
  limit?: number;
  page?: number;
  filter?: GroupsRequestFilterOptions;
  includeRoles?: boolean;
  includeTags?: boolean;
  includeMemberStatistics?: boolean;
  includeHasPermission?: boolean;
  includePlaces?: boolean;
}

export interface GroupInformation {
  ageGroupIds: number[]
  campusId: number | null;
  chatStatus: "NOT_STARTED" | "STARTING" | "STARTED" | "STOPPED";
  color: "accent" | "gray" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";
  dateOfFoundation: string | null;
  endDate: string | null;
  groupCategoryId: string | null;
  groupHomepageUrl: string | null;
  groupStatusId: number;
  groupTypeId: number;
  imageUrl: string | null;
  maxMembers: number | null;
  meetingTime: string | null;
  note: string;
  signUpOverrideRoleId: number | null;
  targetGroupId: number | null;
  weekday: number | null;
}

export interface GroupPermissions {
  "useChat": boolean;
  "startChat": boolean;
}

export interface GroupSettings {
  allowChildRegistration: boolean;
  allowOtherRegistration: boolean;
  allowSameEmailRegistration: boolean;
  allowSpouseRegistration: boolean;
  allowWaitinglist: boolean;
  autoAccept: boolean;
  automaticMoveUp: boolean;
  defaultPostCommentsActive: boolean;
  defaultPostPlaceholderText: string | null;
  defaultPostVisibility: "group_intern" | "group_visible";
  // "dynamicGroupRuleSet": null
  // "dynamicGroupStatus": null
  // "dynamicGroupUpdateFinished": null
  // "dynamicGroupUpdateStarted": null
  groupMeeting: {
    autoCreate: boolean;
    templateId: number | null;
  };
  informLeader: boolean;
  inStatistic: boolean;
  isHidden: boolean;
  isOpenForMembers: boolean;
  isPublic: boolean;
  newMember: {
    campusId: number | null;
    statusId: number | null;
    departmentId: number | null;
  } | null;
  postsEnabled: boolean;
  qrCodeCheckin: boolean;
  qrCodeCheckinAutomaticEmail: boolean;
  signUpHeadline: string | null;
  visibility: "hidden" | "intern" | "restricted" | "public";
  waitinglistMaxPersons: number | null;
}

export interface GroupFollowUp {
  typeId: number | null;
  targetTypeId: number | null;
  targetObjectId: number | null;
  targetGroupMemberStatusId: number | null;
  sendReminderMails: boolean;
}

export interface GroupRole {
  id: number;
  groupTypeId: number;
  name: string;
  nameTranslated: string;
  shorty: string;
  sortKey: number | null;
  isLeader: boolean;
  type: "participant" | "leader";
  isDefault: boolean;
  isHidden: boolean;
  growPathId: null | number;
  groupTypeRoleId: number;
  forceTwoFactorAuth: boolean;
  receiveQRCode: boolean;
  isActive: boolean;
  countsTowardsSeats: boolean;
  canReadChat: boolean;
  canWriteChat: boolean;
}

export interface GroupMemberStatistics {
  participants: number;
  leaders: number;
  seatsTaken: number;
  active: number;
  requested: number;
  to_delete: number;
  waiting: number;
}

export interface GroupPlaces {
  id: 5,
  name: string;
  street: string;
  district: string;
  postalcode: string;
  city: string;
  markerUrl: string;
  geoLat: string;
  geoLng: string;
  createdDate: string;
  createdPerson: { id: 274; }
}

export interface Group {
  followUp: GroupFollowUp;
  guid: string;
  id: number;
  information: GroupInformation;
  modifiedDate: string;
  modifiedPerson: { id: number; }
  name: string;
  permissions: GroupPermissions;
  securityLevelForGroup: number;
  settings: GroupSettings;
  hasPermissions?: boolean;
  memberStatistics?: GroupMemberStatistics;
  places?: GroupPlaces[]
  roles?: GroupRole[];
  tags?: Tag[]
}

export interface GroupsResponse {
  data: Group[];
  meta: {
    count: number;
    all: number;
    pagination: {
      total: number;
      limit: number;
      current: number;
      lastPage: number;
    }
  }
}