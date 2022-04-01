import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './job_vacancy.css';

declare const manywho: any;

export default class JobVacancy extends React.Component<any,any> {

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
                className='jobvacancy-header'
            >
                <span
                    className='jobvacancy-header-label'
                >
                    {tile.properties?.Title?.value as string}
                </span>
            </div>
            
        );

        
        let body: any = (
            <div
                className='jobvacancy-body'
            >
                <div
                    className='jobvacancy-body-text'
                    dangerouslySetInnerHTML={{ __html: tile.properties?.Summary?.value as string }}
                >

                </div>
            </div>
            
        );

        
                

        return (
            <div
                className='mw-tiles-item-container jobvacancy'
                style={{position: "relative", flexBasis: flexBasis, height: "auto"}}
            >
                <div 
                    className={"mw-tiles-item jobvacancy-tile"} 
                    id={this.props.item} 
                    style={{position: "relative"}}
                >
                    
                    <div
                        className='jobvacancy-content'
                    >
                        {header}
                        {body}
                        <div
                            className='jobvacancy-buttonbar'
                        >
                            <img 
                                className='jobvacancy-buttonbar-icon'
                                alt="Share on FaceBook (Opens in new tab)" 
                                src="https://ce0242li.webitrent.com/ce0242li_webrecruitment/webrecruit/img/Facebook.gif" 
                                width="36" 
                                height="36"
                            />
                            <img 
                                className='jobvacancy-buttonbar-icon'
                                alt="Share on LinkedIn (Opens in new tab)" 
                                src="https://ce0242li.webitrent.com/ce0242li_webrecruitment/webrecruit/img/LinkedIn.gif" 
                                width="36" 
                                height="36"
                            />
                            <img 
                                className='jobvacancy-buttonbar-icon'
                                alt="Share on Twitter (Opens in new tab)" 
                                src="https://ce0242li.webitrent.com/ce0242li_webrecruitment/webrecruit/img/Twitter.gif" 
                                width="36" 
                                height="36"
                            />
                            <span
                                className='jobvacancy-buttonbar-button'
                                onClick={(e: any) => {this.itemClicked(e,tile)}}
                            >
                                Apply online
                            </span>
                            

                        </div>
                        <div
                            className='jobvacancy-footer'
                        />
                    </div>
                </div>
            </div>
        );
    }
}