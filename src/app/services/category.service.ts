import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private _http: HttpClient) {}
<<<<<<< HEAD
=======
  //load all the cateogries
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
  public categories() {
    return this._http.get(`${baseUrl}/category/`);
  }

<<<<<<< HEAD
  public categoriesByTenant(tenantId: string) {
    return this._http.get(`${baseUrl}/category/tenant/${tenantId}`);
  }

  public addCategory(category: any) {
=======
  //add new category
  public addCategory(category) {
>>>>>>> 8b131899faaf4c29db739e73430e1f5bc801be43
    return this._http.post(`${baseUrl}/category/`, category);
  }
}
