import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './notice_frame.css';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

export default class NoticeFrame extends React.Component<any,any> {

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
        
        let header: any = (
            <div
                className='noticeframe-header'
            >
                <span
                    className='noticeframe-header-label'
                >
                    {tile.properties?.Title?.value as string}
                </span>
            </div>
            
        );

        
        let body: any = (
            <div
                className='noticeframe-body'
            >
                <span
                    className='noticeframe-body-text'
                >
                    {tile.properties?.Details?.value as string}
                </span>
            </div>
            
        );

        let links: any;
        let linkItems: FlowObjectDataArray=tile.properties?.ChildLinks?.value as FlowObjectDataArray;
        if(linkItems && linkItems.items.length > 0) {
            let linklist: any = [];
            linkItems.items.forEach((link: FlowObjectData) => {
                if(linklist.length>0) linklist.push(", ");
                linklist.push(
                    <li
                        className='noticeframe-link'
                        onClick={(e: any) => { this.itemClicked(e, link)}}
                    >
                        {link.properties.Title?.value}
                    </li>
                );
            });
            links=(
                <div
                    className={"noticeframe-links"}
                >
                    <ul
                        className='noticeframe-linklist'
                    >
                        {linklist}
                    </ul>
                </div>
            );
        }
                

        return (
            <div
                className='mw-tiles-item-container noticeframe'
                style={{position: "relative", flexBasis: flexBasis, height: "auto"}}
            >
                <div 
                    className={"mw-tiles-item noticeframe-tile"} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    
                    <div
                        className='noticeframe-content'
                    >
                        {header}
                        {body}
                    </div>
                    {links}
                </div>
            </div>
        );
    }
}