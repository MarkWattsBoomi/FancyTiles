import { FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './default_tile.css';

declare const manywho: any;

export default class CatalogItem extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
    }

    expand(e: any) {
        
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

        let image: string;
        if(parent.model.displayColumns[1]) {
            image = tile.properties?.[parent.model.displayColumns[1].developerName]?.value as string;
        }
        else {
            image = tile.properties?.Image?.value as string;
        }
        
        let details: string;
        if(parent.model.displayColumns[2]) {
            details = tile.properties?.[parent.model.displayColumns[2].developerName]?.value as string;
        }
        else {
            details = tile.properties?.Details?.value as string;
        }

        let link: string;
        if(parent.model.displayColumns[3]) {
            link = tile.properties?.[parent.model.displayColumns[3].developerName]?.value as string;
        }
        else {
            link = tile.properties?.LinkLabel?.value as string;
        }
       

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
                    </div>
                    {content}
                    <div className="mw-tiles-item-footer list-unstyled">
                        {details}
                    </div>
                </div>
            </div>
        );
    }
}