import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './tweet.css';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

export default class Tweet extends React.Component<any,any> {

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
        
        let icon: any = null;
        let header: any = (
            <div
                className='tweet-header'
            >
                <span
                    className='tweet-header-label'
                >
                    {tile.properties?.Title?.value as string}
                </span>
            </div>
            
        );

        
        let body: any = (
            <div
                className='tweet-body'
            >
                <span
                    className='tweet-body-text'
                >
                    {tile.properties?.Details?.value as string}
                </span>
            </div>
            
        );
        let footer: any = (
            <div
                className='tweet-footer'
            >
                <span
                    className='tweet-footer-text'
                >
                    {tile.properties?.LinkLabel?.value as string}
                </span>
            </div>
            
        );

        let imageName: string = tile.properties?.Image?.value as string;
        let image: any;
        switch(true){
            case imageName?.indexOf("glyphicon") >=0:
                image = (
                    <span 
                        className={"warmlink-icon-icon glyphicon " + imageName}
                    />
                );
                break;
            case imageName?.indexOf("http://") >=0:
            case imageName?.indexOf("https://") >=0:
                image = (
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
                className='mw-tiles-item-container tweet'
                style={{position: "relative", flexBasis: flexBasis, height: "auto"}}
            >
                <div 
                    className={"mw-tiles-item tweet-tile"} 
                    onClick={(e: any) => {this.itemClicked(e, tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    <div
                        className='tweet-content'
                    >
                        {header}
                        {body}
                        {footer}
                        {image}
                    </div>
                </div>
            </div>
        );
    }
}