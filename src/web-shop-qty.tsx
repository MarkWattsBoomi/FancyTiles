import { eContentType, eLoadingState, FlowComponent, FlowField, FlowMessageBox, FlowObjectData, FlowObjectDataArray, FlowObjectDataProperty, FlowOutcome, modalDialogButton } from "flow-component-model";
import React from "react";
import { icons } from "./icons";
import "./web-shop-frm.css";
declare var manywho: any;

export default class WebShopQty extends React.Component<any,any> {

    content: any = (
        <img
            src="https://files-manywho-com.s3.amazonaws.com/8f6d2e19-efc9-4ebc-b70e-616396f7184e/loading-icon-transparent-background-12.jpg"
        />
    );

    constructor(props: any) {
        super(props);
        this.validate=this.validate.bind(this);
        this.makeObjectData=this.makeObjectData.bind(this);
        this.qtyChanged=this.qtyChanged.bind(this);
        this.addOne=this.addOne.bind(this);
        this.removeOne=this.removeOne.bind(this);
        this.props.sft.form = this;
        this.state = {qty: 1}
    }

    qtyChanged(e: any) {
        let newQty: number = e.currentTarget.value;
        let objData: FlowObjectData = this.props.objData;
        let stock: number = objData.properties?.Stock?.value as number;

        if(newQty < 1) {
            newQty = 1;
        }
        if(newQty > stock){
            newQty = stock;
        }
        this.setState({qty: newQty});
    }

    addOne(e: any) {
        let objData: FlowObjectData = this.props.objData;
        let stock: number = objData.properties?.Stock?.value as number;
        if(this.state.qty < stock) {
            this.setState({qty: this.state.qty + 1})
        }
    }

    removeOne(e: any) {
        if(this.state.qty > 1) {
            this.setState({qty: this.state.qty - 1})
        } 
    }

    async componentDidMount(): Promise<void> {
        let sft: any = this.props.sft;
        this.forceUpdate();
    }

    validate() : boolean {
        let valid: boolean = true;
        return valid;
    }

    async makeObjectData() : Promise<FlowObjectData> {
        let objData: FlowObjectData = FlowObjectData.newInstance("OrderCatalogItems REQUEST - CatalogItem");
        let origObjData: FlowObjectData = this.props.objData;
        objData.addProperty(FlowObjectDataProperty.newInstance("PartNumber",eContentType.ContentString,origObjData.properties.PartNumber.value));
        objData.addProperty(FlowObjectDataProperty.newInstance("Title",eContentType.ContentString,origObjData.properties.Title.value));
        objData.addProperty(FlowObjectDataProperty.newInstance("Price",eContentType.ContentNumber,origObjData.properties.Price.value));
        objData.addProperty(FlowObjectDataProperty.newInstance("Quantity",eContentType.ContentNumber,this.state.qty))
        return objData;
    }

    render() {

        let outcome: FlowOutcome = this.props.outcome;
        let form: any = this.props.form;
        let objData: FlowObjectData = this.props.objData;
        let img: string = objData.properties?.ThumbNail?.value as string; 
        let partNo: string = objData.properties?.PartNumber?.value as string; 
        let title: string = objData.properties?.Title?.value as string; 
        let unitQty: string = objData.properties?.UnitQuantity?.value as string; 
        let price: number = objData.properties?.Price?.value as number; 
        let info1: string = objData.properties?.Info1?.value as string;
        let info2: string = objData.properties?.Info2?.value as string;
        let info3: string = objData.properties?.Info3?.value as string;
        let stock: number = objData.properties?.Stock?.value as number;

        this.content = (
            <div
                className="web-shop"
            >
                <div
                    className="web-shop-top"
                >
                    <span
                        className="web-shop-top-title"
                    >
                        {partNo + " " + title + " " + unitQty}
                    </span>
                    <span
                        className="web-shop-top-stock"
                    >
                        {stock + " pcs in stock"}
                    </span>
                </div>
                <div
                    className="web-shop-ctr"
                >
                    <div
                        className="web-shop-left"
                    >
                        
                        <img 
                            className='web-shop-left-thumb'
                            src={img}
                        />
                    </div>
                    <div
                        className="web-shop-mid"
                    >
                        <span
                            className="web-shop-mid-info"
                        >
                            {info1}
                        </span>
                        <span
                            className="web-shop-mid-info"
                        >
                            {info2}
                        </span>
                        <span
                            className="web-shop-mid-info"
                        >
                            {info3}
                        </span>
                    </div>
                    <div
                        className="web-shop-right"
                    >
                        
                        <span
                            className="web-shop-right-price"
                        >
                            {price + " £/pcs"}
                        </span>
                        <div
                            className="web-shop-right-qty"
                        >
                            <button 
                                className="web-shop-qty-button glyphicon  glyphicon-minus"
                                onClick={this.removeOne}
                            />
                            <input 
                                className="web-shop-qty-input"
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
                        <span
                            className="web-shop-right-total"
                        >
                            {"Total £" + (this.state.qty * price)}
                        </span>
                    </div>
                </div>
                <div
                    className="web-shop-bot"
                >
                    <span
                        className="web-shop-bot-title"
                    >
                        {"Items you could also require"}
                    </span>
                </div>

            </div>
        )

        return this.content;
    }
}

manywho.component.register('WebShopQty', WebShopQty);