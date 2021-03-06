import { PopColorsModel } from './../../palletes/model/popup-color.model';
import { LanguageDataModel } from './../model/language.model';
import { ColorsModel } from './../../colors/models/colors.model';
import { AboutModel } from './../../about/model/about.model';
import { FontsData } from './../../fonts/models/fonts-data';
import { IconsList } from './../../icons/models/icon-data';
import { IconData } from '../../icons/models/icon-data';
import { ConfigLoaderService } from './../../config-loader.service';
import { Config } from './../../models/config';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MainTabs } from '../model/main-tabs';

export const HttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'secret-key': '$2a$10$VV2Zl2sZpLWFSifl6gZ3aurw6hbi8ExBJXXM777pqu8zfl4Db5Aua'
  })
};
@Injectable({
  providedIn: 'root'
})
export class UiService {
  darkModeState: BehaviorSubject<boolean>;
  config: Config;
  constructor(
    private http: HttpClient,
    configLoader: ConfigLoaderService
  ) {
    this.config = configLoader.getConfigData();
    this.darkModeState = new BehaviorSubject<boolean>(false);
  }

  public getIconsData(url: string): Observable<IconData[]> {
    return this.http.get<IconData[]>(url, HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        map((icon: any) => icon.categories),
        catchError(this.handleError) // then handle the error
      );
  }

  public getMainTabs(): Observable<MainTabs[]> {
    return this.http.get<MainTabs[]>(this.config['MAIN_TABS_URL'], HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        catchError(this.handleError) // then handle the error
      );
  }

  public getIconsList(): Observable<IconsList[]> {
    return this.http.get<IconsList[]>(this.config['ICONS_LIST_URL'], HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        // map((icon: any) => icon.categories),
        catchError(this.handleError) // then handle the error
      );
  }

  downloadIcon(iconName: string): Observable<Blob> {
    const download_endpoint = `https://material.io/tools/icons/static/icons/baseline-${iconName}-24px.svg`;
    return this.http.get(download_endpoint, { responseType: 'blob' });
  }

  public getFontsData(): Observable<FontsData[]> {
    return this.http.get<FontsData[]>(this.config['FONTS_DATA_URL'], HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        // map((icon: any) => icon.categories),
        catchError(this.handleError) // then handle the error
      );
  }

  public getChangeLog(): Observable<AboutModel[]> {
    return this.http.get<AboutModel[]>(this.config['ABOUT_DATA_URL'], HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        // map((icon: any) => icon.categories),
        catchError(this.handleError) // then handle the error
      );
  }

  public getColorsData(): Observable<ColorsModel[]> {
    return this.http.get<ColorsModel[]>(this.config['COLORS_DATA_URL'], HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        // map((icon: any) => icon.categories),
        catchError(this.handleError) // then handle the error
      );
  }

  public getLanguageData(): Observable<LanguageDataModel[]> {
    return this.http.get<LanguageDataModel[]>(this.config['LANG_DATA_URL'], HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        // map((icon: any) => icon.categories),
        catchError(this.handleError) // then handle the error
      );
  }

  public getPopupColorsData(): Observable<PopColorsModel[]> {
    return this.http.get<PopColorsModel[]>(this.config['POPUP_COLOR_DATA'], HttpOptions)
      .pipe(
        retry(3), // retry a failed request up to 3 times
        // map((icon: any) => icon.categories),
        catchError(this.handleError) // then handle the error
      );
  }

  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
