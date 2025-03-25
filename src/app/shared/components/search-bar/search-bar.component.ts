import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FadeInDirective } from '../../directives/fade-in.directive';
import { MEDIA_TYPE } from '../../enumerations/media-type.enum';
import { GenreFacade } from '../../facades/genre.facade';
import { SearchFacade } from '../../facades/search.facade';
import { SearchResult } from '../../models/search.model';
import { SearchService } from '../../services/search.service';
import { MovieSearchListItemComponent } from '../movie-search-list-item/movie-search-list-item.component';
import { TvShowSearchListItemComponent } from '../tv-show-search-list-item/tv-show-search-list-item.component';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MovieSearchListItemComponent,
        TvShowSearchListItemComponent,
        FadeInDirective,
    ],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements OnInit, AfterViewInit {
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    readonly MEDIA_TYPE = MEDIA_TYPE;
    searchForm!: FormGroup;
    searchResults: Array<SearchResult> = [];
    searchString = '';
    isSearchOpen = this.searchService.isSearchOpen$;
    isSearching = false;

    get searchQueryFormField(): FormControl<string> {
        return this.searchForm.get('searchQuery') as FormControl<string>;
    }

    constructor(
        private formBuilder: FormBuilder,
        private destroyRef: DestroyRef,
        private searchService: SearchService,
        private searchFacade: SearchFacade,
        private genreFacade: GenreFacade,
    ) {}

    ngOnInit(): void {
        this.initSearchForm();
        this.listenForSearchFormChanges();
    }

    ngAfterViewInit(): void {
        this.focusSearchInputElement();
    }

    private focusSearchInputElement(): void {
        this.searchInput?.nativeElement.focus();
    }

    private initSearchForm(): void {
        this.searchForm = this.formBuilder.group({
            searchQuery: ['', Validators.required],
        });
    }

    private listenForSearchFormChanges(): void {
        this.searchQueryFormField.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
            this.searchString = value.trim();

            if (this.searchString.length > 0) {
                this.isSearching = true;
                this.searchFacade
                    .getMulti(this.searchString)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(({ results }) => {
                        this.searchResults = results;
                    });
            } else {
                this.isSearching = false;
            }
            console.log(this.searchString);
        });
    }

    clearSearch(): void {
        this.searchQueryFormField.setValue('');
    }

    toggleSearch(): void {
        this.searchService.toggleSearch();
    }
}
