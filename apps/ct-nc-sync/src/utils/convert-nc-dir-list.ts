import { NCDirEntryItem } from "../models/nc/NCDirEntryItem";
import { NextcloudDirList } from "../models/nc/nextcloud";

export function convertNcDirList(ncResponse: NextcloudDirList): NCDirEntryItem[] {
  const respList = ncResponse["d:multistatus"]["d:response"];
  return respList.map(resp => {
    const href = resp["d:href"];
    const prop = resp["d:propstat"]["d:prop"];
    const rt = prop["d:resourcetype"];
    const isFolder = rt["d:collection"] !== undefined;

    const name = decodeURIComponent(href).replace(/^.*\/([^/]+)\/?$/, "$1");

    return {
      name,
      href,
      isFolder,
      lastModified: prop["d:getlastmodified"],
      eTag: prop["d:getetag"]
    }
  });
}