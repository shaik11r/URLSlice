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
export const getInitstats=()=>{
    return Object.create({
        browser:{
            chrome:0,
            edge:0,
            firefox:0,
            ie:0,
            opera:0,
            other:0,
            safari:0
        },
        os:{
            android:0,
            ios:0,
            linux:0,
            macos:0,
            other:0,
            windows:0,
        },
        country:{},
        referrer:{},
        city:{},
    });
};
export const removeWww=(host="")=>{
    return host.replace("www.","");
};