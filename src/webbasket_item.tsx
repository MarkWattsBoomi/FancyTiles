import { FlowObjectData, FlowOutcome, modalDialogButton } from 'flow-component-model';
import * as React from 'react';
import Tiles from './tiles';
import './web_shop_item.css';
import CommonFunctions from './CommonFunctions';
import { icons } from './icons';

declare const manywho: any;

export default class WebBasketItem extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
        this.state = {enabledOutcomes: []};
        this.viewDetails = this.viewDetails.bind(this);
        this.qtyChanged=this.qtyChanged.bind(this);
        this.addOne=this.addOne.bind(this);
        this.removeOne=this.removeOne.bind(this);
        this.removeItem=this.removeItem.bind(this);       
    }

    addToCart(e: any) {
        e.stopPropagation();
        let parent: Tiles = this.props.parent;
        let oc: FlowOutcome = parent.outcomes["addToCart"];
        let objData: FlowObjectData = parent.tiles.get(this.props.item);
        if(oc) {
            parent.doOutcome(oc, objData);
        }
    }

    viewDetails(e: any) {
        e.stopPropagation();
        let parent: Tiles = this.props.parent;
        let objData: FlowObjectData = parent.tiles.get(this.props.item);
        let partNo: string = objData.properties?.PartNumber?.value as string; 
        let title: string = objData.properties?.Title?.value as string; 
        let unitQty: string = objData.properties?.UnitQuantity?.value as string; 

        parent.messageBox.showMessageBox(
            partNo +  " " + title + " " + unitQty,
            null,
            []
        );
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
        
        let tile: FlowObjectData = parent.tiles.get(this.props.item);
        this.setState({enabledOutcomes, qty: tile.properties?.Quantity?.value as number});
        parent.forceUpdate();
    }

    qtyChanged(e: any) {
        const parent: Tiles = this.props.parent;
        let newQty: number = e.currentTarget.value;
        let objData: FlowObjectData = parent.tiles.get(this.props.item);
        objData.properties.Quantity.value = newQty;
        parent.setStateValue(objData);
        this.setState({qty: newQty});
        if(parent.outcomes["onQuantity"]) {
            parent.triggerOutcome("onQuantity");
        }
    }

    addOne(e: any) {
        const parent: Tiles = this.props.parent;
        let objData: FlowObjectData = parent.tiles.get(this.props.item);
        objData.properties.Quantity.value = this.state.qty + 1;
        parent.setStateValue(objData);
        this.setState({qty: objData.properties.Quantity.value as number});
        if(parent.outcomes["onQuantity"]) {
            parent.triggerOutcome("onQuantity");
        }

    }

    removeOne(e: any) {
        const parent: Tiles = this.props.parent;
        let objData: FlowObjectData = parent.tiles.get(this.props.item);
        objData.properties.Quantity.value = this.state.qty - 1;
        parent.setStateValue(objData);
        this.setState({qty: objData.properties.Quantity.value as number});
        if(parent.outcomes["onQuantity"]) {
            parent.triggerOutcome("onQuantity");
        }
    }

    removeItem(e: any) {
        const parent: Tiles = this.props.parent;
        const objData: FlowObjectData = parent.tiles.get(this.props.item);
        parent.setStateValue(objData);
        if(parent.outcomes["onDelete"]) {
            parent.triggerOutcome("onDelete");
        }
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
        let id: number = tile.properties?.Id?.value as number; 
        let partNo: string = tile.properties?.PartNumber?.value as string; 
        let title: string = tile.properties?.Title?.value as string; 
        let unitQty: string = tile.properties?.UnitQuantity?.value as string; 
        let info1: string = tile.properties?.Info1?.value as string;
        let info2: string = tile.properties?.Info2?.value as string;
        let info3: string = tile.properties?.Info3?.value as string;
        let price: number = tile.properties?.Price?.value as number;
        let stock: number = tile.properties?.Stock?.value as number;
        let thumbnail: string = tile.properties?.ThumbNail?.value as string;
        let total: number = price * this.state.qty;

        
        

        
       
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
                                className="webshop-outcome-button-element webshop-outcome-button-label"
                            >
                                {parent.outcomes[key].label}
                            </span>
                        );
                    }
                    if ((parent.outcomes[key].attributes['display']) && parent.outcomes[key].attributes['display'].value.indexOf('icon') >= 0) {
                        icon = (
                            <span
                                className={'webshop-outcome-button-element webshop-outcome-button-icon glyphicon glyphicon-' + (parent.outcomes[key].attributes['icon'].value || 'plus')}
                            />
                        );
                    }

                    outcomes.push(
                        <div
                            className="webshop-outcome-button"
                            title={parent.outcomes[key].label}
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
                className='webshop-item'
                style={{position: "relative", flexBasis: flexBasis}}
            >
                <div 
                    className={"webshop-tile"} 
                    id={this.props.item} 
                    style={{position: "relative"}}>

                    <div
                        className='webshop-body'
                    >
                        <div
                            className='webshop-body-thumb'
                        >
                            <img 
                                className={"webshop-image"}
                                src={thumbnail}
                            />
                        </div>
                        <div
                            className='webshop-body-details'
                        >
                            <div
                                className='webshop-body-details-row'
                            >
                                <span className='webshop-body-details-title'>{partNo + " - " + title + " " + unitQty}</span>
                            </div>
                            <div
                                className='webshop-body-details-info'
                            >
                                <div
                                    className='webshop-body-details-rows'
                                >
                                    <div
                                        className='webshop-body-details-row'
                                    >
                                        <span className='webshop-body-details-info'>{info1}</span>
                                    </div>
                                    <div
                                        className='webshop-body-details-row'
                                    >
                                        <span className='webshop-body-details-info'>{info2}</span>
                                    </div>
                                    <div
                                        className='webshop-body-details-row'
                                    >
                                        <span className='webshop-body-details-info'>{info3}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className='webbasket-body-right'
                        >
                            <div
                                className="webbasket-body-right-qty"
                            >
                                <button 
                                    className="web-shop-qty-button glyphicon  glyphicon-minus"
                                    onClick={this.removeOne}
                                />
                                <input 
                                    className="webbasket-input-qty"
                                    type="number"
                                    min={1}
                                    max={stock}
                                    value={this.state.qty}
                                    onChange={this.qtyChanged}
                                />
                                <button 
                                    className="web-shop-qty-button glyphicon  glyphicon-plus"
                                    onClick={this.addOne}
                                />
                            </div>
                            <div
                                className="webbasket-body-right-price"
                            >
                                <span
                                    className="webbasket-body-right-label"
                                >
                                    {price + " £/pcs"}
                                </span>
                            </div>
                            <div
                                className="webbasket-body-right-total"
                            >
                                <span
                                    className="webbasket-body-right-label"
                                >
                                    {"£" + total}
                                </span>
                            </div>
                            <div
                                className="webbasket-body-right-buttons"
                            >
                                <span
                                    className='webbasket-body-right-button glyphicon glyphicon-info-sign'
                                    onClick={this.viewDetails}
                                />
                                <span 
                                    className='webbasket-body-right-button glyphicon glyphicon-trash'
                                    onClick={this.removeItem}
                                />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}