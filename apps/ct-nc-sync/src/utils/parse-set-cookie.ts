import { CtCookie } from "../models/ct-rest/CtCookie";

export function parseSetCookie(cookieString: string){
  const parts = cookieString.split(";");

    const flags = {
        domain: true,
        expires: true,
        httpOnly: false,
        maxAge: true,
        partitioned: false,
        path: true,
        secure: false,
        sameSite: true,
    };
    const transformers = {
        // domain: (value) => value,
        expires: (value: string) => Date.parse(value),
        httpOnly: (value: string | undefined) => value === undefined ? true : value,
        maxAge: (value: string) => parseInt(value),
        partitioned: (value: string | undefined) => value === undefined ? true : value,
        // path: (value) => value,
        secure: (value: string | undefined) => value === undefined ? true : value,
        // sameSite: (value) => value,
    };

    const cookieObj: CtCookie = {
        name: '',
        value: '',
        domain: null,
        expires: null,
        httpOnly: false,
        maxAge: null,
        partitioned: false,
        path: null,
        secure: false,
        sameSite: null,
        otherFlags: {}
    };

    const [cookieName, cookieValue] = parts[0].split("=");
    cookieObj.name = cookieName;
    cookieObj.value = cookieValue;

    for(const flagString of parts.slice(1)){
        const [flag, flagValue] = flagString.trim().split("=");
        const flagKey = flag.replace(/-+/g, "").replace(/^(.)/, m => m.toLowerCase());
        const isUnknownFlag = flags[flagKey] === undefined;

        if(isUnknownFlag){
            cookieObj.otherFlags[flag] = flagValue === undefined ? true : flagValue;
            continue;
        }

        cookieObj[flagKey] = transformers[flagKey] ? transformers[flagKey](flagValue) : flagValue;
    }

    return cookieObj;
}