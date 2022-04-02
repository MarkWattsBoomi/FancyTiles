import { eContentType, FlowComponent, FlowDisplayColumn, FlowField, FlowMessageBox, FlowObjectData, FlowObjectDataProperty, FlowOutcome, modalDialogButton } from 'flow-component-model';
import * as React from 'react';
import DefaultTile from './default_tile';
import HotLink from './hot_link';
import JobVacancy from './job_vacancy';
import NewsArticle from './news_article';
import NoticeFrame from './notice_frame';
import PageIndex from './page_index';
import PictureArticle from './picture_article';
import TilesRibbon from './tiles_ribbon';
import Tweet from './tweet';
import WarmLink from './warm_link';
import "./tiles.css";

declare var manywho: any;

export default class Tiles extends FlowComponent {

    tiles: Map<string,FlowObjectData>;
    filteredTiles: Map<string,FlowObjectData>;
    header: TilesRibbon;
    headerElement: any;
    messageBox: FlowMessageBox;
    form: any;  // this is the form being shown by the message box
    globalFilter: string;

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

        this.header = undefined;
        if(this.model.searchable === true) {
            this.headerElement = (
                <TilesRibbon
                    root={this}
                    ref={(element: TilesRibbon) => {this.header=element}}
                />
            );
        }
        this.filterTiles();
    }

    filterTiles() {
        this.filteredTiles = new Map();
        this.tiles.forEach((tile: FlowObjectData) => {
            let matches: Boolean = false;
            if(this.globalFilter && this.globalFilter.length > 0) {
                this.model.displayColumns.forEach((col: FlowDisplayColumn) => {
                    if((tile.properties[col.developerName].value + "").toLowerCase().indexOf(this.globalFilter)>= 0) {
                        matches=true;
                    }
                })
            }
            else {
                matches=true;
            }
            if(matches === true) {
                this.filteredTiles.set(tile.internalId, tile);
            }
        });
        this.forceUpdate();
    }

    async buildRibbon() {
        await this.header?.generateButtons();
        this.forceUpdate();
    }

    async tileClicked(tile: FlowObjectData) {
        await this.setStateValue(tile);
        if(this.outcomes.TileClicked) {
            this.doOutcome(this.outcomes.TileClicked, tile, false);
        }
        else {
            if(Object.values(this.outcomes).values().next()) {
                this.doOutcome(Object.values(this.outcomes).values().next().value,tile,false);
            }
            else {
                manywho.engine.sync(this.flowKey);
            }
        }       
    }

    getTextValue(property: FlowObjectDataProperty): string {
        switch (property.contentType) {
            case eContentType.ContentBoolean:
                if (property.value === true) {
                    return 'True';
                } else {
                    return 'False';
                }
            case eContentType.ContentNumber:
                return property.value.toString();

            default:
                return property.value as string;
        }
    }

    cancelOutcomeForm() {
        this.messageBox.hideMessageBox();
        this.form = null;
        this.forceUpdate();
    }

    async okOutcomeForm() {
        if (this.form.validate() === true) {
            const objData: FlowObjectData = await this.form?.makeObjectData();
            const objDataId: string = this.form.props.objData;
            const outcome: FlowOutcome = this.form.props.outcome;
            const form: any = this.form.props.form;
            if (form.state && objData) {
                const state: FlowField = await this.loadValue(form.state);
                if (state) {
                    state.value = objData;
                    await this.updateValues(state);
                }
            }
            this.messageBox.hideMessageBox();
            this.form = null;
            this.doOutcome(outcome, objData, true);
            this.forceUpdate();
        }
    }

    async doOutcome(outcome: FlowOutcome, selectedItem: FlowObjectData, ignoreRules?: boolean) {
        let objData: FlowObjectData;
        if (outcome) {
            switch (true) {
                // does it have a uri attribute ?
                case outcome.attributes['uri']?.value.length > 0 :
                    let href: string = outcome.attributes['uri'].value;
                    let match: any;
                    while (match = RegExp(/{{([^}]*)}}/).exec(href)) {
                        // could be a property of the selected item or a global variable or a static value - depends also on isBulkAction

                        if (selectedItem && selectedItem.properties[match[1]]) {
                            // objdata had this prop
                            href = href.replace(match[0], (objData.properties[match[1]] ? this.getTextValue(objData.properties[match[1]]) : ''));
                        } else {
                            // is it a known static
                            switch (match[1]) {
                                case 'TENANT_ID':
                                    href = href.replace(match[0], this.tenantId);
                                    break;

                                default:
                                    const fldElements: string[] = match[1].split('->');
                                    // element[0] is the flow field name
                                    const val: FlowField = await this.loadValue(fldElements[0]);
                                    let value: any;
                                    if (val) {
                                        if (fldElements.length > 1) {
                                            let od: FlowObjectData = val.value as FlowObjectData;
                                            for (let epos = 1 ; epos < fldElements.length ; epos ++) {
                                                od = (od as FlowObjectData).properties[fldElements[epos]].value as FlowObjectData;
                                            }
                                            value = od;
                                        } else {
                                            value = val.value;
                                        }
                                    }
                                    href = href.replace(match[0], value);

                            }
                        }
                    }

                    if (outcome.attributes['target']?.value === '_self') {
                        window.location.href = href;
                    } else {
                        const tab = window.open('');
                        if (tab) {
                            tab.location.href = href;
                        } else {
                            console.log('Couldn\'t open a new tab');
                        }
                    }
                    break;

                case outcome.attributes?.form?.value.length > 0 && ignoreRules !== true:
                    const form: any = JSON.parse(outcome.attributes.form.value);
                    const formProps = {
                        id: this.componentId,
                        flowKey: this.flowKey,
                        okOutcome: this.okOutcomeForm,
                        cancelOutcome: this.cancelOutcomeForm,
                        objData: selectedItem,
                        outcome,
                        form,
                        sft: this,
                    };
                    const comp: any = manywho.component.getByName(form.class);
                    const content: any = React.createElement(comp, formProps);
                    this.messageBox.showMessageBox(
                        form.title, content, [new modalDialogButton('Ok', this.okOutcomeForm), new modalDialogButton('Cancel', this.cancelOutcomeForm)],
                    );
                    this.forceUpdate();
                    break;

                default:
                    await this.triggerOutcome(outcome.developerName);
                    break;
            }
        } else {
            manywho.component.handleEvent(
                this,
                manywho.model.getComponent(
                    this.componentId,
                    this.flowKey,
                ),
                this.flowKey,
                null,
            );
        }
        this.forceUpdate();
    }

    globalFilterChanged(filter: string) {
        this.globalFilter = filter?.toLowerCase();;
        this.filterTiles();
    }

    render() {
        manywho.log.info('Rendering Tiles: ' + this.props.id);

        if (this.props.isDesignTime) return null;
        let tiletype: string = this.getAttribute("TileType", "default").toLowerCase();
        let tilesPerRow: number = parseInt(this.getAttribute("TilesPerRow", "4").toLowerCase());

        let header: any;
        let componentStyle: React.CSSProperties = {};
        
        let tiles: any[] = [];
        this.filteredTiles?.forEach((tile: FlowObjectData) => {
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

                case "tweet":
                    if(this.model.label?.length > 0) {
                        header = (
                            <div
                                className='tweet-banner'
                            >
                                {this.model.label}
                            </div>
                        );
                    }
                    tiles.push(
                        <Tweet
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;

                case "pageindex":
                    componentStyle.marginTop = "3.5rem";
                    tiles.push(
                        <PageIndex
                            parent={this}
                            item={tile.internalId}
                            tilesPerRow={tilesPerRow}
                        />
                    );
                    break;

                case "jobvacancy":
                    componentStyle.marginTop = "3.5rem";
                    tiles.push(
                        <JobVacancy
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
                style={componentStyle}
                id={this.props.id} 
                ref="container"
            >
                <FlowMessageBox
                    parent={this}
                    ref={(element: FlowMessageBox) => {this.messageBox = element; }}
                />
                {this.headerElement}
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