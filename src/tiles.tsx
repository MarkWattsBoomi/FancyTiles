import { eContentType, eLoadingState, FlowComponent, FlowDisplayColumn, FlowField, FlowMessageBox, FlowObjectData, FlowObjectDataProperty, FlowOutcome, modalDialogButton } from 'flow-component-model';
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
import TilesFooter from './tiles-footer';
import CatalogItem from './catalog_item';

declare var manywho: any;

export default class Tiles extends FlowComponent {

    tiles: Map<string,FlowObjectData>;
    filteredTiles: Map<string,FlowObjectData>;
    // this holds the max items per page
    maxTilesPerPage: number = 5;

    // this holds the items in pages
    tilePages: Array<Map<string, any>> = [];

    // this holds the current pagination page number
    currentPage: number = 0;

    header: TilesRibbon;
    headerElement: any;
    footer: TilesFooter;
    footerElement: any;
    messageBox: FlowMessageBox;
    form: any;  // this is the form being shown by the message box
    globalFilter: string;
    retries: number = 0;

    constructor(props: any) {
        super(props);

        this.flowMoved = this.flowMoved.bind(this);

        this.buildRibbon=this.buildRibbon.bind(this);
        this.calculateValue=this.calculateValue.bind(this);
        this.callRequest=this.callRequest.bind(this);
        this.cancelOutcomeForm=this.cancelOutcomeForm.bind(this);
        this.doOutcome=this.doOutcome.bind(this);
        this.filterTiles=this.filterTiles.bind(this);
        this.firstPage=this.firstPage.bind(this);
        this.getTextValue=this.getTextValue.bind(this);
        this.globalFilterChanged=this.globalFilterChanged.bind(this);
        this.lastPage=this.lastPage.bind(this);
        this.maxPerPageChanged=this.maxPerPageChanged.bind(this);
        this.nextPage=this.nextPage.bind(this);
        this.okOutcomeForm=this.okOutcomeForm.bind(this);
        this.paginateRows=this.paginateRows.bind(this);
        this.previousPage=this.previousPage.bind(this);
        this.tileClicked=this.tileClicked.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        this.maxTilesPerPage = parseInt(localStorage.getItem('tiles-max-' + this.componentId));
        if(isNaN(this.maxTilesPerPage)) this.maxTilesPerPage = parseInt(this.getAttribute('PaginationSize', "10"));
        this.loadTiles();        
    }

    async componentWillUnmount() {
        await super.componentWillUnmount();
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    async flowMoved(xhr: any, request: any) {
        const me: any = this;
        if (xhr.invokeType === 'FORWARD') {
            if (this.loadingState !== eLoadingState.ready && this.retries < 3) {
                this.retries ++;
                window.setTimeout(function() {me.flowMoved(xhr, request); }, 500);
            } else {
                this.retries = 0;
                this.maxTilesPerPage = parseInt(localStorage.getItem('tiles-max-' + this.componentId));
                if(isNaN(this.maxTilesPerPage)) this.maxTilesPerPage = parseInt(this.getAttribute('PaginationSize', "10"));
            }
        }

    }

    loadTiles() {
        this.tiles = new Map();
        this.model.dataSource?.items.forEach((tile: FlowObjectData) => {
            this.tiles.set(tile.internalId, tile);
        });

        this.header = undefined;
        this.footer = undefined;
        if(this.model.searchable === true) {
            this.headerElement = (
                <TilesRibbon
                    root={this}
                    ref={(element: TilesRibbon) => {this.header=element}}
                />
            );
            this.footerElement = (
                <TilesFooter
                    root={this}
                    ref={(element: TilesFooter) => {this.footer=element}}
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
        this.paginateRows();
    }

    // this goes through currentRowMap and splits them into pages based on maxPageRows
    paginateRows() {
        const start: Date = new Date();
        this.currentPage=0;
        this.tilePages = [];
        let currentPage: Map<string, any> = new Map();
        this.filteredTiles.forEach((item: any, key: string) => {
            if (currentPage.size < this.maxTilesPerPage) {
                currentPage.set(key, undefined);
            } else {
                this.tilePages.push(currentPage);
                currentPage = new Map();
                currentPage.set(key, undefined);
            }
        });
        // add any stragglers
        this.tilePages.push(currentPage);
        this.currentPage = 0;
        const end: Date = new Date();
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
            let itemOutcomes: FlowOutcome[] = Object.values(this.outcomes).filter((outcome: FlowOutcome) => {return outcome.isBulkAction===false});
            let firstOutcome: FlowOutcome = itemOutcomes[0];
            if(firstOutcome) {
                this.doOutcome(firstOutcome,tile,false);
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
            const JSONform: any = JSON.parse(outcome.attributes.form.value);
            if(!form.noOutcome) {
                this.doOutcome(outcome, objData, true);
            }
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
                    let buttons: modalDialogButton[] = [];
                    
                    if(form.noOutcome) {
                        buttons.push(new modalDialogButton('Close', this.cancelOutcomeForm));
                    }
                    else {
                        buttons.push(new modalDialogButton('Ok', this.okOutcomeForm), new modalDialogButton('Cancel', this.cancelOutcomeForm))
                    }
                    const comp: any = manywho.component.getByName(form.class);
                    const content: any = React.createElement(comp, formProps);
                    this.messageBox.showMessageBox(
                        form.title, content, buttons
                    );
                    this.forceUpdate();
                    break;

                default:
                    await this.setStateValue(selectedItem);
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

    maxPerPageChanged(max: number) {
        this.maxTilesPerPage = max || 10;
        localStorage.setItem('tiles-max-' + this.componentId, this.maxTilesPerPage.toString());
        this.paginateRows();
        this.forceUpdate();
    }

    

    async firstPage() {
        this.currentPage = 0;
        this.forceUpdate();
    }

    previousPage() {
        if (this.currentPage > 1) { this.currentPage -= 1; } else { this.currentPage = 0; }
        this.forceUpdate();
    }

    nextPage() {
        if (this.currentPage < (this.tilePages.length - 1)) { this.currentPage += 1; } else { this.currentPage = this.tilePages.length - 1; }
        this.forceUpdate();
    }

    lastPage() {
        this.currentPage = this.tilePages.length - 1 ;
        this.forceUpdate();
    }

    render() {
        manywho.log.info('Rendering Tiles: ' + this.props.id);

        if (this.props.isDesignTime) return null;
        let tiletype: string = this.getAttribute("TileType", "default").toLowerCase();
        let tilesPerRow: number = parseInt(this.getAttribute("TilesPerRow", "4").toLowerCase());

        let header: any;
        let componentStyle: React.CSSProperties = {};
        let itemsStyle: React.CSSProperties = {};
        
        let tiles: any[] = [];
        if (this.tilePages && this.tilePages.length > 0 && this.tilePages[this.currentPage]) {
            this.tilePages[this.currentPage].forEach((xtile: FlowObjectData, key: string) => {
                switch(tiletype) {
                    case "picturearticle":
                        tiles.push(
                            <PictureArticle
                                parent={this}
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;

                    case "hotlink":
                        tiles.push(
                            <HotLink
                                parent={this}
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;

                    case "warmlink":
                        tiles.push(
                            <WarmLink
                                parent={this}
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;

                    case "noticeframe":
                        tiles.push(
                            <NoticeFrame
                                parent={this}
                                item={key}
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
                                item={key}
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
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;

                    case "pageindex":
                        componentStyle.marginTop = "3.5rem";
                        tiles.push(
                            <PageIndex
                                parent={this}
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;

                    case "jobvacancy":
                        componentStyle.marginTop = "3.5rem";
                        tiles.push(
                            <JobVacancy
                                parent={this}
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;

                    case "catalogitem":
                        itemsStyle.marginBottom = "1rem";
                        tiles.push(
                            <CatalogItem
                                parent={this}
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;

                    case "default":
                        tiles.push(
                            <DefaultTile
                                parent={this}
                                item={key}
                                tilesPerRow={tilesPerRow}
                            />
                        );
                        break;
                }
            });
        }
        else {
            tiles.push(
                <div>
                    No Results
                </div>
            );
        }

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
                    style={itemsStyle}
                >
                    {tiles}
                </div>
                {this.footerElement}
            </div>
        );
    }
}

manywho.component.registerItems("tiles", Tiles);

//export const getTiles = () : typeof Tiles => manywho.component.getByName("tiles");

//export default Tiles;