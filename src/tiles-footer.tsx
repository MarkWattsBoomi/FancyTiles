import { FlowDisplayColumn } from 'flow-component-model';
import React from 'react';
import Tiles from './tiles';

export default class TilesFooter extends React.Component<any, any> {

    maxPerPage: any;

    componentDidMount() {
        this.forceUpdate();
        this.maxPerPageChanged = this.maxPerPageChanged.bind(this);
    }

    maxPerPageChanged(e: any) {
        const root: Tiles = this.props.root;
        root.maxPerPageChanged(parseInt(this.maxPerPage.options[this.maxPerPage.selectedIndex].value));
    }

    render() {
        const root: Tiles = this.props.root;

        const summary: string = 'Showing ' + root.filteredTiles?.size + ' items from a total dataset of ' + root.tiles?.size;
        const pag: string = 'page ' + (root.currentPage + 1) + ' of ' + root.tilePages.length;

        let firstPage: any;
        let prevPage: any;
        let nextPage: any;
        let lastPage: any;

        if (root.currentPage > 0) {
            firstPage = (
                <span
                    className="glyphicon glyphicon-fast-backward tiles-footer-pagination-button"
                    title="First page"
                    onClick={root.firstPage}
                />
            );
            prevPage = (
                <span
                    className="glyphicon glyphicon-step-backward tiles-footer-pagination-button"
                    title="Previous page"
                    onClick={root.previousPage}
                />
            );
        } else {
            firstPage = (
                <span
                    className="glyphicon glyphicon-fast-backward tiles-footer-pagination-button tiles-footer-pagination-button-disabled"
                />
            );
            prevPage = (
                <span
                    className="glyphicon glyphicon-step-backward tiles-footer-pagination-button tiles-footer-pagination-button-disabled"
                />
            );
        }

        if (root.currentPage < (root.tilePages.length - 1)) {
            lastPage = (
                <span
                    className="glyphicon glyphicon-fast-forward tiles-footer-pagination-button"
                    title="Last page"
                    onClick={root.lastPage}
                />
            );
            nextPage = (
                <span
                    className="glyphicon glyphicon-step-forward tiles-footer-pagination-button"
                    title="Next page"
                    onClick={root.nextPage}
                />
            );
        } else {
            lastPage = (
                <span
                    className="glyphicon glyphicon-fast-forward tiles-footer-pagination-button tiles-footer-pagination-button-disabled"
                />
            );
            nextPage = (
                <span
                    className="glyphicon glyphicon-step-forward tiles-footer-pagination-button tiles-footer-pagination-button-disabled"
                />
            );
        }

        let options: number[] = [];
        options.push(10, 20, 50, 100);
        if (options.indexOf(root.maxTilesPerPage) < 0) {
            options.push(root.maxTilesPerPage);
        }
        options = options.sort((a, b) => {
            return a - b;
        });

        const opts: any[] = [];
        options.forEach((a: number) => {
            opts.push(
                <option
                    value={a}
                    selected={root.maxTilesPerPage === a}
                >
                    {a}
                </option>,
            );
        });

        const perPage: any = (
            <select
                className={'tiles-footer-select'}
                onChange={this.maxPerPageChanged}
                ref={(element: any) => {this.maxPerPage = element; }}
            >
               {opts}
            </select>
        );

        return (
            <div
                className="tiles-footer"
            >
                <div
                    className="tiles-footer-summary"
                >
                    <span
                        className="tiles-footer-summary-label"
                    >
                        {summary}
                    </span>
                </div>
                <div
                    className="tiles-footer-spacer"
                />
                <div
                    className="tiles-footer-perpage"
                >
                    <div
                        className="tiles-footer-perpage-label"
                    >
                        {'Items per page'}
                    </div>
                    <div
                        className="tiles-footer-perpage-dropdown"
                    >
                        {perPage}
                    </div>
                </div>
                <div
                    className="tiles-footer-pagination"
                >
                    {firstPage}
                    {prevPage}
                    <span className="tiles-footer-pagination-label">{pag}</span>
                    {nextPage}
                    {lastPage}
                </div>
            </div>
        );
    }
}
