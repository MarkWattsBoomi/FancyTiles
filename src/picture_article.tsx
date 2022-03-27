import { FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './default_tile.css';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

export default class PictureArticle extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
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
        
        let content: any = null;
        let header: string = tile.properties?.Title?.value as string;
        let details: string = tile.properties?.Details?.value as string;
        let link: string = tile.properties?.LinkLabel?.value as string;
        let image: string = tile.properties?.Image?.value as string;

        switch(true){
            case image?.indexOf("glyphicon") >=0:
                content = (
                    <div 
                        className="mw-tiles-item-content" 
                        style={{display: 'flex'}}
                    >
                        <span 
                            className={"mw-tiles-item-icon glyphicon " + image}
                        />
                    </div>
                );
                break;

            case image?.indexOf("http://") >=0:
            case image?.indexOf("https://") >=0:
                content = (
                    <div 
                        className="full-width-image" 
                        style={{display: 'flex'}}
                    >
                        <img 
                            className={"deft-large"}
                            src={image}
                        />
                    </div>
                );
                break; 
        }

        return (
            <div
                className='mw-tiles-item-container'
                style={{position: "relative", flexBasis: flexBasis, height: "auto"}}
            >
                <div 
                    className={"mw-tiles-item"} 
                    onClick={(e: any) => {this.itemClicked(e,tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    {content}    
                    <div className="mw-tiles-item-header">
                        <h4 title={header}>{header}</h4>
                    </div>
                    
                    <div className="mw-tiles-item-footer list-unstyled">
                        {details}
                    </div>
                    <div className="ft-link">
                        {link}
                    </div>
                </div>
            </div>
        );
    }
}