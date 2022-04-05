import { FlowObjectData, FlowOutcome } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './contact.css';
import CommonFunctions from './CommonFunctions';

declare const manywho: any;

export default class Contact extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
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
        let flexBasis: string = Math.floor((90 / this.props.tilesPerRow)) + "%";
        
        
        let displayName: string;
        if(parent.model.displayColumns[0]) {
            displayName = tile.properties?.[parent.model.displayColumns[0].developerName]?.value as string;
        }
        else {
            displayName = tile.properties?.Title?.value as string;
        }

        let firstName: string;
        if(parent.model.displayColumns[1]) {
            firstName = tile.properties?.[parent.model.displayColumns[1].developerName]?.value as string;
        }
        else {
            firstName = tile.properties?.FirstName?.value as string;
        }

        let lastName: string;
        if(parent.model.displayColumns[2]) {
            lastName = tile.properties?.[parent.model.displayColumns[2].developerName]?.value as string;
        }
        else {
            lastName = tile.properties?.LastName?.value as string;
        }

        let dateOfBirth: string;
        if(parent.model.displayColumns[3]) {
            dateOfBirth = tile.properties?.[parent.model.displayColumns[3].developerName]?.value as string;
        }
        else {
            dateOfBirth = tile.properties?.DateOfBirth?.value as string;
        }

        let nino: string;
        if(parent.model.displayColumns[4]) {
            nino = tile.properties?.[parent.model.displayColumns[4].developerName]?.value as string;
        }
        else {
            nino = tile.properties?.DateOfBirth?.value as string;
        }

        let position: string;
        if(parent.model.displayColumns[5]) {
            position = tile.properties?.[parent.model.displayColumns[5].developerName]?.value as string;
        }
        else {
            position = tile.properties?.NewPosition?.value as string;
        }

        let avatar: string;
        if(parent.model.displayColumns[6]) {
            avatar = tile.properties?.[parent.model.displayColumns[6].developerName]?.value as string;
        }
        else {
            avatar = tile.properties?.Avatar?.value as string;
        }
        
        

        
       
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
                                className="contact-outcome-button-element contact-outcome-button-label"
                            >
                                {parent.outcomes[key].label}
                            </span>
                        );
                    }
                    if ((parent.outcomes[key].attributes['display']) && parent.outcomes[key].attributes['display'].value.indexOf('icon') >= 0) {
                        icon = (
                            <span
                                className={'contact-outcome-button-element contact-outcome-button-icon glyphicon glyphicon-' + (parent.outcomes[key].attributes['icon'].value || 'plus')}
                            />
                        );
                    }

                    outcomes.push(
                        <div
                            className="contact-outcome-button"
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

        let content: any = null;
        switch(true){
            case avatar?.indexOf("glyphicon") >=0:
                content = (
                    <div 
                        className="mw-tiles-item-content" 
                        style={{display: 'flex'}}
                    >
                        <span 
                            className={"contact-icon glyphicon " + avatar}
                        />
                    </div>
                );
                break;

            case avatar?.indexOf("http://") >=0:
            case avatar?.indexOf("https://") >=0:
                content = (
                    <img 
                        className={"contact-image"}
                        src={avatar}
                    />

                );
                break; 
        }

        return (
            <div
                className='mw-tiles-item-container'
                style={{position: "relative", flexBasis: flexBasis}}
            >
                <div 
                    className={"mw-tiles-item contact-tile"} 
                    onClick={(e: any) => {this.itemClicked(e,tile)}} 
                    id={this.props.item} 
                    style={{position: "relative"}}>
                    
                    <div className="mw-tiles-item-header">
                        <h4 title={displayName}>{displayName + " - " + position}</h4>
                        <div
                            className='contact-outcomes'
                        >
                            {outcomes}
                        </div>
                    </div>
                    <div
                        className='contact-body'
                    >
                        <div
                            className='contact-body-avatar'
                        >
                            {content}
                        </div>
                        <div
                            className='contact-body-details'
                        >
                            <div
                                className='contact-body-details-row'
                            >
                                <span className='contact-body-details-label'>Name:</span>
                                <div
                                    className='contact-body-details-group'
                                >
                                    <span className='contact-body-details-bold'>{firstName}</span>
                                    <span className='contact-body-details-bold'>{lastName}</span>
                                </div> 
                            </div>
                            <div
                                className='contact-body-details-row'
                            >
                                <span className='contact-body-details-label'>D.o.B:</span>
                                <div
                                    className='contact-body-details-group'
                                >
                                    <span className='contact-body-details-normal'>{dateOfBirth}</span>
                                </div>
                            </div>
                            <div
                                className='contact-body-details-row'
                            >
                                <span className='contact-body-details-label'>NINO:</span>
                                <div
                                    className='contact-body-details-group'
                                >
                                    <span className='contact-body-details-normal'>{nino}</span>
                                </div>
                            </div>
                            <div
                                className='contact-body-details-row'
                            >
                                <span className='contact-body-details-label'>New Position:</span>
                                <div
                                    className='contact-body-details-group'
                                >
                                    <span className='contact-body-details-normal'>{position}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}