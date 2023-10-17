import { eventNames } from "../models/user";

export const sanitize={
    domain:(domain)=>({
        ...domain,
        id:domain.uuid,
        uuid:undefined,
        user_id:undefined,
    }),
    link:(link)=>({
        ...link,
        domain_id:undefined,
        user_id:undefined,
        uuid:undefined,
        id:link.uuid,
        link:generateShortLink(link.address,link.domain)
    })
}
export const generateShortLink=(id,domain)=>{
    const protocol=domain?"https://":"http://";
    return `${protocol}${domain||evn.DEFAULT_DOMAIN}/${id}`;
}
