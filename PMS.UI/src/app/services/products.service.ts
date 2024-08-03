import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  base_url: string = "https://localhost:7238";

  constructor(private http: HttpClient) { }

getProducts(pageNumber: number, pageSize: number, sortBy?: string, sortDirection: string = 'asc', searchTerm?: string): Observable<any> {
  let params = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (sortBy) {
    params += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;
  }
  if (searchTerm) {
    params += `&name=${searchTerm}`;
  }
  return this.http.get<any>(`${this.base_url}/api/products${params}`, { withCredentials: true });
}

  addProduct(newProduct: Product): Observable<Product>{
    newProduct.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Product>(this.base_url + '/api/products', newProduct, { withCredentials: true });
  }

  getProduct(productId: string) :Observable<Product> {
    return this.http.get<Product>(this.base_url + `/api/products/${productId}`, { withCredentials: true })
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.base_url + `/api/products/${product.id}`, product, { withCredentials: true });
  }
  
  deleteProduct(product: Product): Observable<Product> {
    return this.http.delete<Product>(this.base_url + `/api/products/${product.id}`, { withCredentials: true })
  }

  getSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(this.base_url + `/api/products/search?query=${query}`, { withCredentials: true });
  }
}
