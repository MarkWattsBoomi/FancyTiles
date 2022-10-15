import { eContentType, FlowField, FlowObjectData, FlowObjectDataProperty, FlowOutcome } from 'flow-component-model';
import Tiles from './tiles';

export default class CommonFunctions {

    static async getFlowValue(): Promise<any> {

    }

    static async assessGlobalOutcomeRule(outcome: FlowOutcome, root: Tiles): Promise<boolean> {
        let result: boolean = true;

        //if (outcome.attributes['RequiresSelected']?.value === 'true' && root.selectedRowMap.size < 1) {
        //    result = false;
        //}

        if (outcome.attributes.rule && outcome.attributes.rule.value.length > 0) {
            try {
                const rule = JSON.parse(outcome.attributes.rule.value);
                let value: any;
                let contentType: eContentType;
                // since this is a global then the value of the rule.field must be a flow field or the property of one
                // split the rule.field on the separator
                let match: any;
                let fld: string = rule.field;
                while (match = RegExp(/{{([^}]*)}}/).exec(fld)) {
                    // is it a known static
                    switch (match[1]) {
                        case 'TENANT_ID':
                            contentType = eContentType.ContentString;
                            value = 'MyTenentId';
                            break;

                        default:
                            const fldElements: string[] = match[1].split('->');
                            // element[0] is the flow field name
                            let val: FlowField;
                            if (root.fields[fldElements[0]]) {
                                val = root.fields[fldElements[0]];
                            } else {
                                val = await root.loadValue(fldElements[0]);
                            }

                            if (val) {
                                let od: FlowObjectData = val.value as FlowObjectData;
                                if (od) {
                                    if (fldElements.length > 1) {
                                        for (let epos = 1 ; epos < fldElements.length ; epos ++) {
                                            contentType = (od as FlowObjectData).properties[fldElements[epos]]?.contentType;
                                            od = (od as FlowObjectData).properties[fldElements[epos]].value as FlowObjectData;
                                        }
                                        value = od;
                                    } else {
                                        value = val.value;
                                        contentType = val.contentType;
                                    }
                                } else {
                                    value = val.value;
                                    contentType = val.contentType;
                                }
                            }
                            break;
                    }
                    fld = fld.replace(match[0], value);
                }

                result = result && CommonFunctions.assessRule(value, rule.comparator, rule.value, contentType);
            } catch (e) {
                console.log('The rule on top level outcome ' + outcome.developerName + ' is invalid');
            }
        }

        return result;
    }

    static async assessRowOutcomeRule(outcome: FlowOutcome, row: FlowObjectData, root: Tiles): Promise<boolean> {
        let result: boolean = true;
        if (outcome.attributes.rule && outcome.attributes.rule.value.length > 0) {
            try {
                const rule = JSON.parse(outcome.attributes.rule.value);
                let value: any;
                let contentType: eContentType;
                let match: any;
                let fld: string = rule.field;
                while (match = RegExp(/{{([^}]*)}}/).exec(fld)) {
                    // is it a known static
                    switch (match[1]) {
                        case 'TENANT_ID':
                            contentType = eContentType.ContentString;
                            value = 'MyTenentId';
                            break;

                        default:
                            const fldElements: string[] = match[1].split('->');
                            // element[0] is the flow field name
                            let val: FlowField;
                            if (root.fields[fldElements[0]]) {
                                val = root.fields[fldElements[0]];
                            } else {
                                val = await root.loadValue(fldElements[0]);
                            }

                            if (val) {
                                let od: FlowObjectData = val.value as FlowObjectData;
                                if (od) {
                                    if (fldElements.length > 1) {
                                        for (let epos = 1 ; epos < fldElements.length ; epos ++) {
                                            contentType = (od as FlowObjectData).properties[fldElements[epos]]?.contentType;
                                            od = (od as FlowObjectData).properties[fldElements[epos]].value as FlowObjectData;
                                        }
                                        value = od;
                                    } else {
                                        value = val.value;
                                        contentType = val.contentType;
                                    }
                                } else {
                                    value = val.value;
                                    contentType = val.contentType;
                                }
                            }
                            break;
                    }
                    fld = fld.replace(match[0], value);
                }

                if (row.properties[fld]) {
                    const property: FlowObjectDataProperty = row.properties[fld];
                    result = CommonFunctions.assessRule(property.value, rule.comparator, rule.value, property.contentType);
                } else {
                    result = CommonFunctions.assessRule(value, rule.comparator, rule.value, contentType);
                }

            } catch (e) {
                console.log('The rule on row level outcome ' + outcome.developerName + ' is invalid');
            }
        }
        return result;
    }

    static assessRule(value: any, comparator: string, compareTo: string, fieldType: eContentType): boolean {
        let comparee: any;
        let comparer: any;
        let result: boolean = true;
        switch (fieldType) {
            case eContentType.ContentNumber:
                comparee = parseInt(compareTo);
                comparer = value;
                break;
            case eContentType.ContentDateTime:
                comparee = new Date(compareTo);
                comparer = value;
                break;
            case eContentType.ContentBoolean:
                comparee = ('' + compareTo).toLowerCase() === 'true';
                comparer = value;
                break;
            case eContentType.ContentString:
            default:
                comparee = compareTo.toLowerCase();
                comparer = (value as string)?.toLowerCase();
                break;
        }

        switch (comparator.toLowerCase()) {
            case 'equals':
                result = comparer === comparee;
                break;
            case 'not equals':
                result = comparer !== comparee;
                break;
            case 'contains':
                result = comparer.indexOf(comparee) >= 0;
                break;
            case 'not contains':
                result = comparer.indexOf(comparee) < 0;
                break;
            case 'starts with':
                result = ('' + comparer).startsWith(comparee);
                break;
            case 'ends with':
                result = ('' + comparer).endsWith(comparee);
                break;
            case 'in':
                result = comparer.indexOf(comparee) >= 0;
                break;
            case 'not in':
                result = comparer.indexOf(comparee) < 0;
                break;
            case 'lt':
                result = parseInt('' + comparer) < parseInt('' + comparee);
                break;
            case 'lte':
                result = parseInt('' + comparer) <= parseInt('' + comparee);
                break;
            case 'gt':
                result = parseInt('' + comparer) > parseInt('' + comparee);
                break;
            case 'gte':
                result = parseInt('' + comparer) >= parseInt('' + comparee);
                break;
        }
        return result;
    }

    static stringifyValue(objData: FlowObjectData, propName: string) : string {
        let val: string = "";
        let prop: FlowObjectDataProperty = objData.properties[propName];
        if(prop){
            switch(prop.contentType){
                case eContentType.ContentDateTime:
                    let dt: Date=new Date(Date.parse(prop.value as string)); 
                    if(isNaN(dt.getTime())){
                        val="";
                    }
                    else {
                        val=dt.toLocaleString();
                    }
                    break;
                default:
                    val=prop.value as string;
            }
        }
        else {
            val = "";
            //"Attribute [" + propName + "] is not defined or does not have a value"
        }
        return val;
    }

    static getAttributeValue(tiles: Tiles, tile: FlowObjectData, attribute: string) : string {
        let attributeName: string = "";
        

        //default to the display column order
        switch(attribute.toLowerCase()) {
            case "title":
                //are we given the explicit column ?
                if (tiles.getAttribute("TitleColumn")?.length) {
                    return CommonFunctions.stringifyValue(tile, tiles.getAttribute("TitleColumn"));
                }
                else {
                    if(tiles.model.displayColumns[0]) {
                        return CommonFunctions.stringifyValue(tile, tiles.model.displayColumns[0].developerName);
                    }
                    else {
                        return CommonFunctions.stringifyValue(tile, "Title");
                    }
                }

            case "image":
                //are we given the explicit column ?
                if (tiles.getAttribute("ImageColumn")?.length) {
                    return tile.properties?.[tiles.getAttribute("ImageColumn")]?.value as string;
                }
                else {
                    if(tiles.model.displayColumns[1]) {
                        return tile.properties?.[tiles.model.displayColumns[1]?.developerName]?.value as string;
                    }
                    else {
                        return tile.properties?.Image?.value as string;
                    }
                }
                
            case "detail":
                //are we given the explicit column ?
                if (tiles.getAttribute("DetailsColumn")?.length) {
                    return CommonFunctions.stringifyValue(tile, tiles.getAttribute("DetailsColumn"));
                }
                else {
                    if(tiles.model.displayColumns[2]) {
                        return CommonFunctions.stringifyValue(tile, tiles.model.displayColumns[2]?.developerName);
                    }
                    else {
                        return CommonFunctions.stringifyValue(tile, "Details");
                    }
                }

            case "link":
                //are we given the explicit column ?
                if (tiles.getAttribute("LinkColumn")?.length) {
                    return tile.properties?.[tiles.getAttribute("LinkColumn")]?.value as string;
                }
                else {
                    if(tiles.model.displayColumns[3]) {
                        return tile.properties?.[tiles.model.displayColumns[3]?.developerName]?.value as string;
                    }
                    else {
                        return tile.properties?.LinkLabel?.value as string;
                    }
                }
            
            case "date":
                //are we given the explicit column ?
                if (tiles.getAttribute("DateColumn")?.length) {
                    let prop: FlowObjectDataProperty = tile.properties?.[tiles.getAttribute("DateColumn")];
                    let val: string = "";
                    if(prop){
                        switch (prop.contentType) {
                            case eContentType.ContentDateTime:
                                let dt: Date = new Date(prop.value as string);
                                if(! isNaN(dt.getTime())) {
                                    val = dt.toLocaleString();
                                }
                        }
                    }
                    return val;
                }
                else {
                    if(tiles.model.displayColumns[3]) {
                        return tile.properties?.[tiles.model.displayColumns[4]?.developerName]?.value as string;
                    }
                    else {
                        return tile.properties?.LinkLabel?.value as string;
                    }
                }

            case "author":
                //are we given the explicit column ?
                if (tiles.getAttribute("AuthorColumn")?.length) {
                    return tile.properties?.[tiles.getAttribute("AuthorColumn")]?.value as string;
                }
                else {
                    if(tiles.model.displayColumns[3]) {
                        return tile.properties?.[tiles.model.displayColumns[4]?.developerName]?.value as string;
                    }
                    else {
                        return tile.properties?.LinkLabel?.value as string;
                    }
                }
                      
        }
        
    }
}
