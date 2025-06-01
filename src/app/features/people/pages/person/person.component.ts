import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ButtonType } from '../../../../shared/components/button/enumerations/button-type.enum';
import { ButtonLink } from '../../../../shared/components/button/models/button.model';
import { ImageGridComponent } from '../../../../shared/components/image-grid/image-grid.component';
import { MediaGridComponent } from '../../../../shared/components/media-grid/media-grid.component';
import { PersonDetailsComponent } from '../../../../shared/components/person-details/person-details.component';
import { SectionHeaderComponent } from '../../../../shared/components/section-header/section-header.component';
import { DEFAULT } from '../../../../shared/constants/defaults.constant';
import { FadeInDirective } from '../../../../shared/directives/fade-in.directive';
import { AspectRatio } from '../../../../shared/enumerations/aspect-ratio.enum';
import { MediaType } from '../../../../shared/enumerations/media-type.enum';
import { PeopleFacade } from '../../../../shared/facades/people.facade';
import { ExternalIds } from '../../../../shared/models/external-ids.model';
import {
    Backdrop,
    Logo,
    MovieCreditsCastPerson,
    Poster,
    TvCreditsCastPerson,
} from '../../../../shared/models/media.model';
import { MovieItem } from '../../../../shared/models/movie.model';
import { PersonDetails } from '../../../../shared/models/people.model';
import { TvShowItem } from '../../../../shared/models/tv-show.model';

@Component({
    standalone: true,
    selector: 'app-person',
    imports: [
        CommonModule,
        SectionHeaderComponent,
        ImageGridComponent,
        ButtonComponent,
        PersonDetailsComponent,
        MediaGridComponent,
        FadeInDirective,
    ],
    templateUrl: './person.component.html',
    styleUrl: './person.component.scss'
})
export class PersonComponent implements OnInit {
    personId!: number;
    personDetails!: PersonDetails;
    isLoading = true;
    movieCastItems: Array<MovieItem> = [];
    tvCastItems: Array<TvShowItem> = [];
    images: Array<Poster | Backdrop | Logo> = [];
    movieCast: Array<MovieCreditsCastPerson> = [];
    tvCast: Array<TvCreditsCastPerson> = [];
    externalIds?: ExternalIds;
    mediaLinks: Array<ButtonLink> = [];
    gender: string = '';

    readonly buttonType = ButtonType;
    readonly personType = MediaType.Person;
    readonly mediaType = MediaType;
    readonly aspectRatio = AspectRatio;
    readonly default = DEFAULT;

    constructor(
        private route: ActivatedRoute,
        private peopleFacade: PeopleFacade,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.loadPersonDetails();
    }

    private updateProperties(): void {
        this.images = this.personDetails?.images?.profiles || [];
        this.movieCast = (this.personDetails?.movie_credits?.cast as Array<MovieCreditsCastPerson>) || [];
        this.tvCast = (this.personDetails?.tv_credits?.cast as unknown as Array<TvCreditsCastPerson>) || [];

        const externalIds = Object.fromEntries(
            Object.entries(this.personDetails?.external_ids || {}).filter(([value]) => value !== null),
        ) as unknown as ExternalIds;
        this.externalIds = Object.keys(externalIds).length > 0 ? externalIds : undefined;

        this.mediaLinks = [
            { path: 'https://www.imdb.com/name/' + this.externalIds?.imdb_id, isExternal: true },
            { path: 'https://www.facebook.com/' + this.externalIds?.facebook_id, isExternal: true },
            { path: 'https://www.instagram.com/' + this.externalIds?.instagram_id, isExternal: true },
            { path: 'https://www.twitter.com/' + this.externalIds?.twitter_id, isExternal: true },
        ];

        switch (this.personDetails?.gender) {
            case 1:
                this.gender = 'Female';
                break;
            case 2:
                this.gender = 'Male';
                break;
            default:
                this.gender = '';
        }
    }

    private loadPersonDetails(): void {
        this.route.paramMap
            .pipe(
                tap(() => {
                    this.isLoading = true;
                }),
                takeUntilDestroyed(this.destroyRef),
                switchMap((params) => {
                    const id = Number(params.get('id'));
                    return id ? this.peopleFacade.getPersonDetails(id) : EMPTY;
                }),
            )
            .subscribe((personDetails) => {
                this.personDetails = personDetails;
                this.updateProperties();
                this.createMovieCastItems(this.movieCast);
                this.createTvCastItems(this.tvCast);
                this.isLoading = false;
            });
    }

    private createMovieCastItems(cast: Array<MovieCreditsCastPerson>): void {
        this.movieCastItems = cast.map((item: MovieCreditsCastPerson) => ({
            id: item.id,
            title: item.title || '',
            original_title: item.original_title || '',
            overview: item.character || '',
            poster_path: item.poster_path || '',
            backdrop_path: item.backdrop_path || '',
            genre_ids: item.genre_ids || [],
            genres: [],
            release_date: item.release_date || '',
            vote_average: item.vote_average || 0,
            vote_count: item.vote_count || 0,
            popularity: item.popularity || 0,
            original_language: item.original_language || '',
            video: item.video || false,
            adult: item.adult || false,
        }));
    }

    private createTvCastItems(cast: Array<TvCreditsCastPerson>): void {
        this.tvCastItems = cast.map((item: TvCreditsCastPerson) => ({
            id: item.id,
            title: item.name || '',
            original_name: item.original_name || '',
            overview: item.character || '',
            poster_path: item.poster_path || '',
            backdrop_path: item.backdrop_path || '',
            genre_ids: item.genre_ids || [],
            genres: [],
            first_air_date: item.first_air_date || '',
            vote_average: item.vote_average || 0,
            vote_count: item.vote_count || 0,
            popularity: item.popularity || 0,
            origin_country: item.origin_country || [],
            name: item.name || '',
        }));
    }
}
