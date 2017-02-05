const defaultName = "mockedFunction";

export function nameFunc(funcOrName?: Function | string) : string{
    if(funcOrName === undefined)
        return defaultName;

    if(typeof funcOrName === 'string' ){
        return funcOrName;
    }

    if(funcOrName.name === "" || funcOrName.name === undefined){
        return defaultName;
    }

    return funcOrName.name
}
