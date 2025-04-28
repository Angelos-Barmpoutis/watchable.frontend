import { Directive } from '@angular/core';

import { DEFAULT } from '../constants/defaults.constant';

@Directive()
export abstract class BaseListItemComponent<T> {
    items: Array<T> = [];
    itemsPerPage = DEFAULT.itemsPerPage;
    currentPage = DEFAULT.page;
    totalPages = DEFAULT.totalPages;
    isLoading = true;

    protected get skeletonArray(): Array<number> {
        return Array(this.itemsPerPage)
            .fill(0)
            .map((_, index) => index);
    }

    protected trackByIndex(index: number): number {
        return index;
    }

    protected loadMore(): void {
        if (this.currentPage < this.totalPages && !this.isLoading) {
            this.currentPage++;
            this.getItems();
        }
    }

    protected abstract trackByItemId(index: number, item: T): number;
    protected abstract getItems(): void;
}
