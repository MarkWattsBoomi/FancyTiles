import { FlowObjectData, FlowObjectDataArray } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './job_vacancy.css';
import CommonFunctions from './CommonFunctions';

declare const manywho: any;

export default class JobVacancy extends React.Component<any,any> {

    expanded: boolean = false;

    constructor(props: any) {
        super(props);
        this.itemClicked=this.itemClicked.bind(this);
        this.state = {enabledOutcomes: []};
    }

    async componentDidMount(): Promise<void> {
        const enabledOutcomes: string[] = [];
        const parent: Tiles = this.props.parent;
        const objData: FlowObjectData = parent.tiles.get(this.props.item);
        const keys: string[] = Object.keys(parent.outcomes);
        for (let pos = 0 ; pos < keys.length ; pos++) {
            if (parent.outcomes[keys[pos]].isBulkAction === false) {
                if (await CommonFunctions.assessRowOutcomeRule(parent.outcomes[keys[pos]], objData, parent) === true) {
                    enabledOutcomes.push(keys[pos]);
                }
            }
        }
        this.setState({enabledOutcomes});
        parent.forceUpdate();
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

        let outcomes: any[] = [];
        Object.keys(parent.outcomes).forEach((key: string) => {
            if (parent.outcomes[key].isBulkAction === false) {
                const showOutcome: boolean = this.state.enabledOutcomes.indexOf(key) >= 0;

                if (showOutcome === true) {
                    let icon: any;
                    let label: any;

                    if ((!parent.outcomes[key].attributes['display']) || parent.outcomes[key].attributes['display'].value.indexOf('text') >= 0) {
                        label = (
                            <span
                                className="jobvacancy-buttonbar-button"
                            >
                                {parent.outcomes[key].label}
                            </span>
                        );
                    }
                    if ((parent.outcomes[key].attributes['display']) && parent.outcomes[key].attributes['display'].value.indexOf('icon') >= 0) {
                        icon = (
                            <span
                                className={'default-outcome-button-element default-outcome-button-icon glyphicon glyphicon-' + (parent.outcomes[key].attributes['icon'].value || 'plus')}
                            />
                        );
                    }

                    outcomes.push(
                        <div
                            className="jobvacancy-buttonbar-buttons"
                            title={parent.outcomes[key].label}
                            onClick={(event: any) => {
                                event.preventDefault();
                                event.stopPropagation();
                                parent.doOutcome(parent.outcomes[key], tile);
                            }}
                        >
                            {icon}
                            {label}

                        </div>,
                    );
                }
            }
        });
        
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
                            {outcomes}
                            
                            

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