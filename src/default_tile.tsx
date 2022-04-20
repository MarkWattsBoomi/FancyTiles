import { FlowObjectData, FlowOutcome } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './default_tile.css';
import CommonFunctions from './CommonFunctions';

declare const manywho: any;

export default class DefaultTile extends React.Component<any,any> {

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
        
        let header: string = CommonFunctions.getAttributeValue(parent, tile, "title");
        //if(parent.model.displayColumns[0]) {
        //    header = tile.properties?.[parent.model.displayColumns[0].developerName]?.value as string;
        //}
        //else {
        //    header = tile.properties?.Title?.value as string;
        //}

        let image: string = CommonFunctions.getAttributeValue(parent, tile, "image");;
        //if(parent.model.displayColumns[1]) {
        //    image = tile.properties?.[parent.model.displayColumns[1].developerName]?.value as string;
        //}
        //else {
        //    image = tile.properties?.Image?.value as string;
        //}
        
        let details: string = CommonFunctions.getAttributeValue(parent, tile, "detail");;
        //if(parent.model.displayColumns[2]) {
        //    details = tile.properties?.[parent.model.displayColumns[2].developerName]?.value as string;
        //}
        //else {
        //    details = tile.properties?.Details?.value as string;
        //}

        let link: string = CommonFunctions.getAttributeValue(parent, tile, "link");;
        //if(parent.model.displayColumns[3]) {
        //    link = tile.properties?.[parent.model.displayColumns[3].developerName]?.value as string;
        //}
        //else {
        //    link = tile.properties?.LinkLabel?.value as string;
        //}
       
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
                                className="default-outcome-button-element default-outcome-button-label"
                            >
                                {parent.outcomes[key].label}
                            </span>
                        );
                    }
                    if ((parent.outcomes[key].attributes['display']) && parent.outcomes[key].attributes['display'].value.indexOf('icon') >= 0) {
                        icon = (
                            <span
                                className={'default-outcome-button-element default-outcome-button-icon glyphicon glyphicon-' + (parent.outcomes[key].attributes['icon'].value || 'plus')}
                            />
                        );
                    }

                    outcomes.push(
                        <div
                            className="default-outcome-button"
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
                            className={"default-icon glyphicon " + image}
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
                            className={"default-image"}
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
                    className={"mw-tiles-item default-tile"} 
                    onClick={(e: any) => {this.itemClicked(e,tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}>
                    
                    <div className="mw-tiles-item-header">
                        <h4 title={header}>{header}</h4>
                        <div
                            className='default-outcomes'
                        >
                            {outcomes}
                        </div>
                    </div>
                    {content}
                    <div 
                        className="mw-tiles-item-footer list-unstyled"
                        dangerouslySetInnerHTML={{ __html: details }} 
                    />
                </div>
            </div>
        );
    }
}