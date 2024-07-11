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

  getAllProducts() : Observable <Product[]> {
    return this.http.get<Product[]>(this.base_url + '/api/products');
  }

  addProduct(newProduct: Product): Observable<Product>{
    newProduct.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Product>(this.base_url + '/api/products', newProduct);
  }

  getProduct(productId: string) :Observable<Product> {
    return this.http.get<Product>(this.base_url + `/api/products/${productId}`)
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.base_url + `/api/products/${product.id}`, product);
  }
  
  deleteProduct(product: Product): Observable<Product> {
    return this.http.delete<Product>(this.base_url + `/api/products/${product.id}`)
  }

}
