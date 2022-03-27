import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './hot_link.css';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

export default class HotLink extends React.Component<any,any> {

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
        
        let icon: any = null;
        let header: any = (
            <span
                className='hotlink-header-label'
            >{tile.properties?.Title?.value as string}</span>
        );
        let details: string = tile.properties?.Details?.value as string;
        let link: string = tile.properties?.LinkLabel?.value as string;
        let image: string = tile.properties?.Image?.value as string;

        switch(true){
            case image?.indexOf("glyphicon") >=0:
                icon = (
                    <span 
                        className={"hotlink-header-icon glyphicon " + image}
                    />
                );
                break;
        }

        let headerClass: string = "hotlink-header";
        let headerStyle: React.CSSProperties = {};
        headerStyle.backgroundColor=tile.properties?.BannerColour?.value as string;

        let expander: any;
        if(this.expanded===true) {
            expander = (
                <span 
                    className={"hotlink-header-button glyphicon glyphicon-triangle-top"}
                    onClick={(e: any) => {this.toggleExpand(e)}}
                />
            );
        }
        else {
            expander = (
                <span 
                    className={"hotlink-header-button glyphicon glyphicon-triangle-bottom"}
                    onClick={(e: any) => {this.toggleExpand(e)}}
                />
            );
        }

        let links: any = [];
        let linkClass: string = "hotlink-links";
        let linkItems: FlowObjectDataArray=tile.properties?.ChildLinks?.value as FlowObjectDataArray;
        if(linkItems && linkItems.items.length > 0) {
            linkItems.items.forEach((link: FlowObjectData) => {
                if(links.length>0) links.push(", ");
                links.push(
                    <span
                        className='hotlink-link'
                        onClick={(e: any) => { this.itemClicked(e, link)}}
                    >
                        {link.properties.Title?.value}
                    </span>
                );
            })
        }

        let childMenu: any;
        if(this.expanded) {
            let childMenuItems = [];
            let listItems: FlowObjectDataArray=tile.properties?.MenuLinks?.value as FlowObjectDataArray;
            if(listItems && listItems.items.length > 0) {
                listItems.items.forEach((link: FlowObjectData) => {
                    childMenuItems.push(
                        <div
                            className='hotlink-menuitem'
                            onClick={(e: any) => { this.itemClicked(e, link)}}
                        >
                            <span
                                className='hotlink-menuitem-label'
                            >
                                {link.properties.Title?.value}
                            </span>
                            <span
                                className='hotlink-menuitem-chevron glyphicon glyphicon-menu-right'
                            />
                        </div>
                    );
                })
            }
            childMenuItems.push(
                <span
                    className='hotlink-menuitem hotlink-menuitem-all'
                    onClick={(e: any) => { this.itemClicked(e, tile)}}
                >
                    {"See all"}
                </span>
            );
            childMenu = (
                <div
                    className='hotlink-menuitems'
                >
                    {childMenuItems}
                </div>
            );
        }

        return (
            <div
                className='mw-tiles-item-container'
            >
                <div 
                    className={"mw-tiles-item"} 
                    onClick={(e: any) => {this.itemClicked(e, tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    <div
                        className={headerClass}
                        style={headerStyle}
                    >
                        {icon}
                        {header}
                        {expander}
                    </div>
                    <div
                        className={linkClass}
                    >
                        {links}
                    </div>
                    {childMenu}
                </div>
            </div>
        );
    }
}