import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './page_index.css';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

export default class PageIndex extends React.Component<any,any> {

    expanded: boolean = false;

    constructor(props: any) {
        super(props);
        this.itemClicked=this.itemClicked.bind(this);
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
        let flexBasis: string = Math.floor(((100 / this.props.tilesPerRow)-1)) + "%";
        let state: FlowObjectData = parent.getStateValue() as FlowObjectData;
        let valueClass: string="pageindex-body-text";
        if(state) {
            if(state.internalId !== this.props.item) {
                valueClass += " pageindex-body-text-selected";
            }
        }
        
        let body: any = (
            <div
                className='pageindex-body'
            >
                <span
                    className='pageindex-body-title'
                >
                    {tile.properties?.Title?.value as string}
                </span>
                <span
                    className={valueClass}
                >
                    {tile.properties?.Details?.value as string}
                </span>
            </div>
            
        );

        return (
            <div
                className='mw-tiles-item-container pageindex'
                style={{position: "relative", flexBasis: flexBasis, height: "auto"}}
            >
                <div 
                    className={"mw-tiles-item pageindex-tile"} 
                    onClick={(e: any) => {this.itemClicked(e, tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    {body}
                </div>    
            </div>
        );
    }
}