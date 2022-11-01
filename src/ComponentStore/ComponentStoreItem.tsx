import { FlowObjectData, FlowOutcome, modalDialogButton } from 'flow-component-model';
import * as React from 'react';
import Tiles from '../tiles';
import './ComponentStoreItem.css';
import CommonFunctions from '../CommonFunctions';
import { icons } from '../icons';

declare const manywho: any;

export default class ComponentStoreItem extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.state = {enabledOutcomes: []};
        this.viewVersionInfo = this.viewVersionInfo.bind(this);
        this.downloadComponent = this.downloadComponent.bind(this);
    }


    viewVersionInfo(e: any) {
        e.stopPropagation();
        let parent: Tiles = this.props.parent;
        let tile: FlowObjectData = parent.tiles.get(this.props.item);
        let versionNote: string = CommonFunctions.getAttributeValue(parent,tile,"version_note");
        let version: string = CommonFunctions.getAttributeValue(parent,tile,"version");
        parent.messageBox.showMessageBox(
            "Version " + version + " Info",
            versionNote,
            []
        );
    }

    downloadComponent(e: any) {
        e.stopPropagation();
        let parent: Tiles = this.props.parent;
        let tile: FlowObjectData = parent.tiles.get(this.props.item);
        let compLink: string = CommonFunctions.getAttributeValue(parent,tile,"comp_link");
        let title: string = CommonFunctions.getAttributeValue(parent,tile,"name"); 
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                //const url = URL.createObjectURL(blob);
                link.setAttribute('href', compLink);
                link.setAttribute('download', title+".component");
                link.setAttribute('target',"_blank");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
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
        let id: number = parseInt(CommonFunctions.getAttributeValue(parent,tile,"Id") ||"0");
        let title: string = CommonFunctions.getAttributeValue(parent,tile,"name"); 
        let description: string = CommonFunctions.getAttributeValue(parent,tile,"description"); 
        let thumbnail: string = CommonFunctions.getAttributeValue(parent,tile,"image"); 
        let version: string = CommonFunctions.getAttributeValue(parent,tile,"version");
        let author: string = CommonFunctions.getAttributeValue(parent,tile,"author");
        let created: string = CommonFunctions.getAttributeValue(parent,tile,"createdDate");
        let modified: string = CommonFunctions.getAttributeValue(parent,tile,"modifiedDate");
        let git: string = CommonFunctions.getAttributeValue(parent,tile,"gitLink");
        let compLink: string = CommonFunctions.getAttributeValue(parent,tile,"comp_link");
        let versionNote: string = CommonFunctions.getAttributeValue(parent,tile,"version_note");
        
        

        
       
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
                                className="compstore-button compstore-button-label"
                            >
                                {parent.outcomes[key].label}
                            </span>
                        );
                    }
                    if ((parent.outcomes[key].attributes['display']) && parent.outcomes[key].attributes['display'].value.indexOf('icon') >= 0) {
                        icon = (
                            <span
                                className={'compstore-button compstore-button-icon glyphicon glyphicon-' + (parent.outcomes[key].attributes['icon'].value || 'plus')}
                            />
                        );
                    }

                    outcomes.push(
                        <div
                            className="compstore-button"
                            title={parent.outcomes[key].label}
                            onClick={(e: any) =>{parent.triggerOutcome(key)}}
                        >
                            {icon}
                            {label}

                        </div>,
                    );
                }
            }
        });


        return (
            <div
                className='compstore-item'
                style={{position: "relative", flexBasis: flexBasis}}
            >
                <div 
                    className={"compstore-tile"} 
                    id={this.props.item} 
                    style={{position: "relative"}}>

                    <div
                        className='compstore-body'
                    >
                        <div
                            className='compstore-header'
                        >
                            <div
                                className='compstore-title'
                            >
                                <span>{title}</span>
                            </div>
                            <div
                                className='compstore-buttons'
                            >
                                <div
                                    className="compstore-button"
                                    title="Download component file"
                                    onClick={this.downloadComponent} 
                                >
                                    <span
                                        className='compstore-button glyphicon glyphicon-cloud-download'                                
                                    />
                                </div>
                                
                                {outcomes}
                            </div>
                        </div>
                        <div
                            className='compstore-row1'
                        >
                            <div
                                className='compstore-thumb'
                            >
                                <img 
                                    className={"compstore-thumb-image"}
                                    src={thumbnail}
                                />
                            </div>
                            <div className='compstore-details'>
                                <div className='compstore-details-row'>
                                    <span
                                        className='compstore-details-label'
                                    >
                                        {"Author:"}
                                    </span>
                                    <span
                                        className='compstore-details-value'
                                    >
                                        {author}
                                    </span>
                                </div>
                                <div className='compstore-details-row'>
                                    <span
                                        className='compstore-details-label'
                                    >
                                        {"Current Version:"}
                                    </span>
                                    <span
                                        className='compstore-details-value'
                                    >
                                        {version}
                                    </span>
                                    <span
                                        className='compstore-details-button-info glyphicon glyphicon-info-sign'
                                        onClick={this.viewVersionInfo} 
                                    />
                                </div>
                                <div className='compstore-details-row'>
                                    <span
                                        className='compstore-details-label'
                                    >
                                        {"Created:"}
                                    </span>
                                    <span
                                        className='compstore-details-value'
                                    >
                                        {created}
                                    </span>
                                </div>
                                <div className='compstore-details-row'>
                                    <span
                                        className='compstore-details-label'
                                    >
                                        {"Last Modified:"}
                                    </span>
                                    <span
                                        className='compstore-details-value'
                                    >
                                        {modified}
                                    </span>
                                </div>
                                <div className='compstore-details-row'>
                                    <span
                                        className='compstore-details-label'
                                    >
                                        {"Git:"}
                                    </span>
                                    <a
                                        className='compstore-details-value'
                                        href={git}
                                        target="_blank"
                                    >
                                        {git}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div
                            className='compstore-row2'
                        >
                            <div 
                                className='compstore-description'
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        </div>
                        {/*
                        <div
                            className='webshop-body-details'
                        >
                            <div
                                className='webshop-body-details-row'
                            >
                                <span className='webshop-body-details-title'>{title}</span>
                            </div>
                            <div
                                className='webshop-body-details-info'
                            >
                                <div
                                    className='webshop-body-details-pop'
                                >
                                    <span
                                        className='webshop-body-button-info glyphicon glyphicon-info-sign'
                                        onClick={this.viewDetails} 
                                    />
                                </div>
                                <div
                                    className='webshop-body-details-rows'
                                >
                                    <div
                                        className='webshop-body-details-row'
                                    >
                                        <span className='webshop-body-details-info'>{description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className='webshop-body-right'
                        >
                            <div
                                className='webshop-body-right-top'
                            >
                                <span
                                    className='webshop-body-stock'
                                >
                                    {"Current Version " + version}
                                </span>
                            </div>
                            <div
                                className='webshop-body-right-bottom'
                            >
                                <span
                                    className='webshop-body-price'
                                >
                                    {}
                                </span>
                                <div
                                    className='webshop-cart'
                                    onClick={this.addToCart}
                                    title="Add to cart"
                                >
                                    <img 
                                        className='webshop-cart-icon'
                                        src={icons.cart}
                                    />
                                    <span 
                                        className='webshop-cart-marker glyphicon glyphicon-plus'
                                    />
                                </div>                              
                            </div>
                        </div>
        */}
                    </div>
                    
                </div>
            </div>
        );
    }
}