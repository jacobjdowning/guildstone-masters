import { ShallowWrapper } from "enzyme";

export function findRowFromName(tableBody:ShallowWrapper, name:string){
    return tableBody.findWhere(wrapper => {
        if (wrapper.type() !== 'tr'){ return false }
        
        return wrapper.find('th').text() === name
    })
}