import { FlowObjectData, FlowOutcome } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './catalog_item.css';
import CommonFunctions from './CommonFunctions';

declare const manywho: any;

export default class CatalogItem extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.state = {enabledOutcomes: []};
    }

    async componentDidMount(): Promise<void> {
        const enabledOutcomes: string[] = [];
        const parent: Tiles = this.props.parent;
        const objData: FlowObjectData = parent.tiles.get(this.props.item);
        const keys: string[] = Object.keys(parent.outcomes);
        for (let pos = 0 ; pos < keys.length ; pos++) {
            if (parent.outcomes[keys[pos]].isBulkAction === false) {
                if (await CommonFunctions.assessRowOutcomeRule(parent.outcomes[keys[pos]], objData, parent) === true) {
                    enabledOutcomes.push(keys[pos]);
                }
            }
        }
        this.setState({enabledOutcomes});
        parent.forceUpdate();
    }

    itemClicked(e: any, item: FlowObjectData) {
        e.stopPropagation();
        let parent: Tiles = this.props.parent;
        parent.tileClicked(item);
    }

    render() {

        manywho.log.info(`Rendering Tile Item: ${this.props.item}`);
        let parent: Tiles = this.props.parent;
        let tile: FlowObjectData = parent.tiles.get(this.props.item);
        let flexBasis: string = Math.floor((90 / this.props.tilesPerRow)) + "%";
        
        let content: any = null;
        let header: string;
        if(parent.model.displayColumns[0]) {
            header = tile.properties?.[parent.model.displayColumns[0].developerName]?.value as string;
        }
        else {
            header = tile.properties?.Title?.value as string;
        }

        let details: string = CommonFunctions.getAttributeValue(parent, tile, "Description");
        let short_details: string = details;
        if(short_details.length > 100) {
            short_details = short_details.substring(0,100) + "...";
        }
        /*if(parent.model.displayColumns[1]) {
            CommonFunctions.getAttributeValue(parent, tile, "detail")
            details = tile.properties?.[parent.model.displayColumns[1].developerName]?.value as string;
        }
        else {
            details = tile.properties?.Details?.value as string;
        }
        */

        let type: string;
        let tileStyle: React.CSSProperties = {};
        let footerStyle: React.CSSProperties = {};
        let tileIcon: any;
        let tileLabel: string;
        if(parent.model.displayColumns[2]) {
            type = tile.properties?.[parent.model.displayColumns[2].developerName]?.value as string;
        }
        else {
            type = tile.properties?.LinkLabel?.value as string;
        }
        switch(type.toLowerCase()) {
            case "catalog":
                tileStyle.backgroundColor = "#b3c2f1";
                footerStyle.backgroundColor = "#b3c2f1";
                tileIcon = (<span className='catalogitem-icon glyphicon glyphicon-book'/>);
                tileLabel = "Service Catalog";
                break;

            case "casestudy":
                tileStyle.backgroundColor = "#fcfdde";
                footerStyle.backgroundColor = "#fcfdde";
                tileIcon = (<span className='catalogitem-icon glyphicon glyphicon-briefcase'/>);
                tileLabel = "Case Study"
                break;

            case "customdemo":
                tileStyle.backgroundColor = "#d2e9df";
                footerStyle.backgroundColor = "#d2e9df";
                tileIcon = (<span className='catalogitem-icon glyphicon glyphicon-blackboard'/>);
                tileLabel = "Demonstration"
                break;

            case "architecture":
                tileStyle.backgroundColor = "#edb2c3";
                footerStyle.backgroundColor = "#edb2c3";
                tileIcon = (<span className='catalogitem-icon glyphicon glyphicon-education'/>);
                tileLabel = "Ref. Architecture"
                break;
        }

        let tileFooter: string;
        if(parent.model.displayColumns[3]) {
            tileFooter = tile.properties?.[parent.model.displayColumns[3].developerName]?.value as string;
        }
        else {
            tileFooter = tile.properties?.LinkLabel?.value as string;
        }

        let image: string;
        if(parent.model.displayColumns[4]) {
            image = tile.properties?.[parent.model.displayColumns[3].developerName]?.value as string;
        }
        else {
            image = tile.properties?.Image?.value as string;
        }
        
        

        
       
        let outcomes: any[] = [];
        Object.keys(parent.outcomes).forEach((key: string) => {
            if (parent.outcomes[key].isBulkAction === false) {
                const showOutcome: boolean = this.state.enabledOutcomes.indexOf(key) >= 0;

                if (showOutcome === true) {
                    let icon: any;
                    let label: any;

                    if ((!parent.outcomes[key].attributes['display']) || parent.outcomes[key].attributes['display'].value.indexOf('text') >= 0) {
                        label = (
                            <span
                                className="catalogitem-outcome-button-element catalogitem-outcome-button-label"
                            >
                                {parent.outcomes[key].label}
                            </span>
                        );
                    }
                    if ((parent.outcomes[key].attributes['display']) && parent.outcomes[key].attributes['display'].value.indexOf('icon') >= 0) {
                        icon = (
                            <span
                                className={'catalogitem-outcome-button-element catalogitem-outcome-button-icon glyphicon glyphicon-' + (parent.outcomes[key].attributes['icon'].value || 'plus')}
                            />
                        );
                    }

                    outcomes.push(
                        <div
                            className="catalogitem-outcome-button"
                            title={parent.outcomes[key].label}
                            onClick={(event: any) => {
                                event.preventDefault();
                                event.stopPropagation();
                                parent.doOutcome(parent.outcomes[key], tile);
                            }}
                        >
                            {icon}
                            {label}

                        </div>,
                    );
                }
            }
        });

        switch(true){
            case image?.indexOf("glyphicon") >=0:
                content = (
                    <div 
                        className="mw-tiles-item-content" 
                        style={{display: 'flex'}}
                    >
                        <span 
                            className={"catalogitem-icon glyphicon " + image}
                        />
                    </div>
                );
                break;

            case image?.indexOf("http://") >=0:
            case image?.indexOf("https://") >=0:
                content = (
                    <div 
                        className="mw-tiles-item-content" 
                        style={{display: 'flex'}}
                    >
                        <img 
                            className={"catalogitem-image"}
                            src={image}
                        />
                    </div>
                );
                break; 
        }

        return (
            <div
                className='mw-tiles-item-container'
                style={{position: "relative", flexBasis: flexBasis}}
            >
                <div 
                    className={"mw-tiles-item catalogitem-tile"} 
                    onClick={(e: any) => {this.itemClicked(e,tile)}} 
                    id={this.props.item} 
                    
                >
                    <div 
                        className="catalogitem-header"
                    >
                        <div
                            className='catalogitem-title-emblem'
                            style={tileStyle}
                        />
                        <div
                            className='catalogitem-header-icons'
                        >
                            {tileIcon}
                            <div
                                className='catalogitem-label'
                            >
                                {tileLabel}
                            </div>
                            <div
                                className='catalogitem-outcomes'
                            >
                                {outcomes}
                            </div>
                        </div>
                        <div
                            className='catalogitem-header-title'
                        >
                            <span 
                                className='catalogitem-title'
                                title={header}
                            >
                                {header}
                            </span>
                        </div>
                        
                        
                    </div>
                    {content}
                    <div 
                        className="catalogitem-body" 
                        title={details}
                        dangerouslySetInnerHTML={{ __html: short_details}} 
                    />
                    <div 
                        className="catalogitem-footer"
                    >
                        {tileFooter}
                    </div>
                </div>
            </div>
        );
    }
}