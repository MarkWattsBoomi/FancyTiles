import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './warm_link.css';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

export default class WarmLink extends React.Component<any,any> {

    expanded: boolean = false;

    constructor(props: any) {
        super(props);
        this.toggleExpand=this.toggleExpand.bind(this);
        this.itemClicked=this.itemClicked.bind(this);
    }

    toggleExpand(e: any) {
        e.stopPropagation();
        this.expanded= !this.expanded;
        this.forceUpdate();
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
                className='warmlink-header'
            >
                <span
                    className='warmlink-header-label'
                >
                    {tile.properties?.Title?.value as string}
                </span>
                <span
                    className='warmlink-header-icon glyphicon glyphicon-menu-right'
                />
            </div>
            
        );
        
        

        let body: any = (
            <div
                className='warmlink-body'
            >
                <span
                    className='warmlink-body-text'
                >
                    {tile.properties?.Details?.value as string}
                </span>
            </div>
            
        );

        let image: string = tile.properties?.Image?.value as string;
        switch(true){
            case image?.indexOf("glyphicon") >=0:
                icon = (
                    <span 
                        className={"warmlink-icon-icon glyphicon " + image}
                    />
                );
                break;
        }


        let links: any = [];
        let linkClass: string = "warmlink-links";
        let linkItems: FlowObjectDataArray=tile.properties?.ChildLinks?.value as FlowObjectDataArray;
        if(linkItems && linkItems.items.length > 0) {
            linkItems.items.forEach((link: FlowObjectData) => {
                if(links.length>0) links.push(", ");
                links.push(
                    <span
                        className='warmlink-link'
                        onClick={(e: any) => { this.itemClicked(e, link)}}
                    >
                        {link.properties.Title?.value}
                    </span>
                );
            })
        }

        

        return (
            <div
                className='mw-tiles-item-container'
                style={{position: "relative", flexBasis: flexBasis, height: "auto"}}
            >
                <div 
                    className={"mw-tiles-item warmlink"} 
                    onClick={(e: any) => {this.itemClicked(e, tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    <div
                        className='warmlink-icon'
                    >
                            {icon}
                    </div>
                    <div
                        className='warmlink-content'
                    >
                        {header}
                        {body}
                        <div
                            className={linkClass}
                        >
                            {links}
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}