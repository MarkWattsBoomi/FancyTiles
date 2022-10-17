import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './news_article.css';
import CommonFunctions from './CommonFunctions';

declare const manywho: any;

interface IDropDownState {
    options?: any[];
    search?: string;
    isOpen?: boolean;
}

export default class NewsArticle extends React.Component<any,any> {

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
        
        let headerField: string = CommonFunctions.getAttributeValue(parent, tile, "title");

        let imageField: string = CommonFunctions.getAttributeValue(parent, tile, "image");;
        
        let detailsField: string = CommonFunctions.getAttributeValue(parent, tile, "detail");;

        let linkField: string = CommonFunctions.getAttributeValue(parent, tile, "link");;
        let dateField: string = CommonFunctions.getAttributeValue(parent, tile, "date");;
        let authorField: string = CommonFunctions.getAttributeValue(parent, tile, "author");;

        let headerElement: any = (
            <div
                className='newsarticle-header'
            >
                <span
                    className='newsarticle-header-label'
                >
                    {headerField + (dateField?.length > 0 ? " " + dateField : "") + (authorField?.length > 0 ? " - " + authorField : "")}
                </span>
            </div>
            
        );

        
        let bodyElement: any = (
            <div
                className='newsarticle-body'
            >
                <span
                    className='newsarticle-body-text'
                    dangerouslySetInnerHTML={{__html: detailsField}}
                />
            </div>
            
        );
        let footerElement: any = (
            <div
                className='newsarticle-footer'
            >
                <span
                    className='newsarticle-footer-text'
                >
                    {linkField}
                </span>
            </div>
            
        );

        
        let imageElement: any;
        switch(true){
            case imageField?.indexOf("glyphicon") >=0:
                imageElement = (
                    <span 
                        className={"warmlink-icon-icon glyphicon " + imageField}
                    />
                );
                break;
            case imageField?.indexOf("http://") >=0:
            case imageField?.indexOf("https://") >=0:
                imageElement = (
                    <div 
                        className="full-width-image" 
                        style={{display: 'flex'}}
                    >
                        <img 
                            className={"deft-large"}
                            src={imageField}
                        />
                    </div>
                );
                break;
        }


        

        

        return (
            <div
                className='mw-tiles-item-container newsarticle'
                style={{position: "relative", flexBasis: flexBasis, height: "auto"}}
            >
                <div 
                    className={"mw-tiles-item newsarticle-tile"} 
                    onClick={(e: any) => {this.itemClicked(e, tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    
                    <div
                        className='newsarticle-content'
                    >
                        {headerElement}
                        {bodyElement}
                        {footerElement}
                    </div>
                    <div
                        className='newsarticle-image'
                    >
                            {imageElement}
                    </div>
                </div>
            </div>
        );
    }
}