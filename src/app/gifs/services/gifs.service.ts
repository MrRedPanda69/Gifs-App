import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey: string = 'WQdgVJggqaZhDivtPvZ9ltX6KzaQGFhR';
  private _history: string[] = [];
  private serviceURL: string = 'http://api.giphy.com/v1/gifs'

  public results: Gif[] = [];

  get history() {
    return [...this._history];
  }

  constructor(private http: HttpClient) {
    
    this._history = JSON.parse(localStorage.getItem('history')!) || [];
    this.results = JSON.parse(localStorage.getItem('lastSearch')!) || [];
  }

  searchGifs(query: string = '') {

    query = query.trim().toLocaleLowerCase();

    if(!this._history.includes(query)) {
      this._history.unshift(query);
      this._history = this._history.splice(0, 10);

      localStorage.setItem('history', JSON.stringify(this._history));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query)

    this.http.get<SearchGifsResponse>(`${this.serviceURL}/search`, {params} )
      .subscribe( (resp) => {
        this.results = resp.data;
        localStorage.setItem('lastSearch', JSON.stringify(this.results));
      });
  }
}

