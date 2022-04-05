import { FlowDisplayColumn, FlowObjectData, FlowOutcome } from "flow-component-model";
import React, { CSSProperties } from "react";
import CommonFunctions from "./CommonFunctions";
import Tiles from "./tiles";
import "./tiles.css";

export default class TilesRibbon extends React.Component<any,any> {
    searchInput: HTMLInputElement;
    previousFilter: string = '';
    currentFilter: string;
    leftButtons: any[];
    rightButtons: any[];
    deBounce: boolean = false;
    dropDowns: Map<string,HTMLSelectElement>;
    dropDownElements: any[];

    constructor(props: any) {
        super(props);
        this.generateButtons = this.generateButtons.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.filterKeyDown = this.filterKeyDown.bind(this);
        this.filterChanged = this.filterChanged.bind(this);
        this.filterCommitted = this.filterCommitted.bind(this);
        this.selectsChanged = this.selectsChanged.bind(this);
        this.setDropdown = this.setDropdown.bind(this);
    }

    async componentDidMount() {
        await this.generateButtons();
        this.selectsChanged=this.selectsChanged.bind(this);
    }

    setDropdown(key: string, element: any) {
        if(element) {
            this.dropDowns.set(key,element);
        }
        else {
            this.dropDowns.delete(key);
        }
    }

    selectsChanged(e: any) {
        const root: Tiles = this.props.root;
        root.selectsChanged();
    }

    async generateButtons(): Promise<any> {
        if(this.deBounce === true) {
            return true;
        }
        else {
            this.deBounce = true;
        }
        const root: Tiles = this.props.root;
        this.leftButtons = [];
        this.rightButtons = [];
        const canExport: boolean = (root.getAttribute('canExport', 'true').toLowerCase() === 'true');

        const arrOutcomes: FlowOutcome[] = Array.from(Object.values(root.outcomes));

        for (let pos = 0 ; pos < arrOutcomes.length ; pos++) {

            const outcome: FlowOutcome = arrOutcomes[pos];

            if (outcome.isBulkAction && outcome.developerName !== 'OnSelect' && outcome.developerName !== 'OnChange' && !outcome.developerName.toLowerCase().startsWith('cm')) {

                const showOutcome: boolean = await CommonFunctions.assessGlobalOutcomeRule(outcome, root);

                if (showOutcome === true) {
                    this.rightButtons.push(
                        <div
                            className={'tiles-ribbon-button-wrapper ' + (outcome.attributes?.classes?.value)}
                            onClick={(e: any) => {root.doOutcome(outcome, undefined); }}
                        >
                            {outcome.attributes?.icon ?
                                <span
                                    key={outcome.developerName}
                                    className={'glyphicon glyphicon-' + (outcome.attributes['icon']?.value || 'plus') + ' tiles-ribbon-button-icon'}
                                    title={outcome.label || outcome.developerName}

                                /> :
                                null
                            }
                            {!outcome.attributes?.display || outcome.attributes.display?.value.indexOf('text') >= 0 ?
                                <span
                                    className="tiles-ribbon-button-label"
                                >
                                    {outcome.label}
                                </span> :
                                null
                            }
                        </div>,
                    );
                }
            }
        }

        //use the display cols from parent to add extra filter dropdowns
        this.dropDownElements = [];
        this.dropDowns = new Map();
        root.model.displayColumns.forEach((col: FlowDisplayColumn) => {
            if(col.visible) {
                let possibleValues: any[] = [];
                root.tiles.forEach((tile: FlowObjectData) => {
                    if(possibleValues.indexOf(tile.properties[col.developerName].value) < 0) {
                        possibleValues.push(tile.properties[col.developerName].value);
                    }
                });
                possibleValues=possibleValues.sort();
                let options: any[] = [];
                options.push(
                    <option
                        className="tiles-ribbon-select-option"
                        value={"*"}
                    >
                        Any
                    </option>
                );
                possibleValues.forEach((value: any) => {
                    options.push(
                        <option
                            className="tiles-ribbon-select-option"
                            value={(value + "" ).toLowerCase()}
                        >
                            {value}
                        </option>
                    );
                });
                this.dropDownElements.push(
                    <div
                        className="tiles-ribbon-select-wrapper"
                    >
                        <span
                            className="tiles-ribbon-select-label"
                        >
                            {col.label}
                        </span>
                        <select
                            id={col.developerName}
                            key={col.developerName}
                            className="tiles-ribbon-select"
                            onChange={this.selectsChanged}
                            ref={(element: HTMLSelectElement) => {this.setDropdown(col.developerName, element)}}
                        >
                            {options}
                        </select>
                    </div>
                    
                );
            }
        });
        this.deBounce = false;
        this.forceUpdate();
        return true;
    }

    clearSearch(e: any) {
        this.currentFilter = '';
        this.forceUpdate();
        this.filterCommitted();
    }

    filterChanged() {
        this.currentFilter = this.searchInput.value;
        this.forceUpdate();
    }

    filterCommitted() {
        if (this.currentFilter !== this.previousFilter) {
            this.previousFilter = this.currentFilter;
            const root: Tiles = this.props.root;
            root.globalFilterChanged(this.currentFilter);
        }
    }

    filterKeyDown(e: any) {
        // e.preventDefault();

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                e.stopPropagation();
                this.filterCommitted();
                return false;
                break;

            case 'Escape':
                e.preventDefault();
                e.stopPropagation();
                this.searchInput.value = this.previousFilter;
                return false;
                break;

            case 'Delete':
                e.preventDefault();
                e.stopPropagation();
                this.searchInput.value = '';
                return false;
                break;

            case 'Tab':
                this.filterCommitted();
                return false;
                break;

            default:
                break;
        }
    }

    render() {

        const root: Tiles = this.props.root;

        const style: CSSProperties = {};
        
        return (
            <div
                className="tiles-ribbon"
                style={style}
            >
                <div
                    className="tiles-ribbon-left-wrapper"
                >
                    <div
                        className="tiles-ribbon-wrapper"
                    >
                        <span
                            className="glyphicon glyphicon-search tiles-ribbon-icon"
                            onClick={this.filterCommitted}
                        />
                        <input
                            className="tiles-ribbon-input"
                            ref={(element: HTMLInputElement) => {this.searchInput = element; }}
                            onKeyDown={this.filterKeyDown}
                            onKeyUp={(e: any) => {e.stopPropagation(); e.preventDefault(); }}
                            onChange={this.filterChanged}
                            value={this.currentFilter}
                        />
                        <span
                            className="glyphicon glyphicon-remove tiles-ribbon-icon"
                            role="button"
                            onClick={this.clearSearch}
                        />
                    </div>
                    <div
                        className="tiles-ribbon-selects-wrapper"
                    >
                        {this.dropDownElements}
                    </div>
                    
                </div>
                <div
                    className="tiles-ribbon-right-wrapper"
                >
                    <div
                        className="tiles-ribbon-buttons-wrapper"
                    >
                        {this.leftButtons}
                        {this.rightButtons}
                    </div>
                </div>
            </div>
        );
    }
}