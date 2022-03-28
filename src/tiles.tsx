import { FlowComponent, FlowObjectData } from 'flow-component-model';
import * as React from 'react';
import DefaultTile from './default_tile';
import HotLink from './hot_link';
import NewsArticle from './news_article';
import NoticeFrame from './notice_frame';
import PictureArticle from './picture_article';
import WarmLink from './warm_link';

declare var manywho: any;

export default class Tiles extends FlowComponent {

    tiles: Map<string,FlowObjectData>;
    constructor(props: any) {
        super(props);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        this.loadTiles();        
    }

    loadTiles() {
        this.tiles = new Map();
        this.model.dataSource?.items.forEach((tile: FlowObjectData) => {
            this.tiles.set(tile.internalId, tile);
        });
        this.forceUpdate();
    }

    async tileClicked(tile: FlowObjectData) {
        await this.setStateValue(tile);
        if(this.outcomes.TileClicked) {
            this.triggerOutcome("TileClicked")
        }
        else {
            manywho.engine.sync(this.flowKey);
        }
    }

    render() {
        manywho.log.info('Rendering Tiles: ' + this.props.id);

        if (this.props.isDesignTime) return null;
        let tiletype: string = this.getAttribute("TileType", "default").toLowerCase();
        let tilesPerRow: number = parseInt(this.getAttribute("TilesPerRow", "4").toLowerCase());

        let header: any;
        
        let tiles: any[] = [];
        this.tiles?.forEach((tile: FlowObjectData) => {
            switch(tiletype) {
                case "picturearticle":
                    tiles.push(
                        <PictureArticle
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;

                case "hotlink":
                    tiles.push(
                        <HotLink
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;

                case "warmlink":
                    tiles.push(
                        <WarmLink
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;

                case "noticeframe":
                    tiles.push(
                        <NoticeFrame
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;

                case "newsarticle":
                    if(this.model.label?.length > 0) {
                        header = (
                            <div
                                className='newsarticle-banner'
                            >
                                {this.model.label}
                            </div>
                        );
                    }
                    tiles.push(
                        <NewsArticle
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;

                case "default":
                    tiles.push(
                        <DefaultTile
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;
            }
        });

        let className = manywho.styling.getClasses(
            this.props.parentId,
            this.props.id,
            'tiles',
            this.props.flowKey,
        ).join(' ');

        return (
            <div 
                className={className} 
                id={this.props.id} 
                ref="container"
            >
                {header}
                <div 
                    className="mw-tiles-items"
                >
                    {tiles}
                </div>
            </div>
        );
    }
}

manywho.component.registerItems("tiles", Tiles);

//export const getTiles = () : typeof Tiles => manywho.component.getByName("tiles");

//export default Tiles;