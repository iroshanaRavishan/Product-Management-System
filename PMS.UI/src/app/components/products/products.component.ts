import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product.model';
import { ProductsService } from 'src/app/services/products.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  loadedPages: number = 0;
  pages: number[] = [];
  isLoading = false;
  sortBy: string = '';
  sortDirection: string = 'asc';

  constructor(private productService: ProductsService, private router: Router) { }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.products.slice(start, end);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    if (this.loadedPages < this.currentPage) {
      this.isLoading = true;
      const pagesToLoad = Math.ceil((this.currentPage * this.pageSize) / this.pageSize);
      const requests = [];

      for (let i = this.loadedPages + 1; i <= pagesToLoad; i++) {
        requests.push(this.productService.getProducts(i, this.pageSize, this.sortBy, this.sortDirection).pipe(
          tap(data => {
            this.totalItems = data.totalItems;
            this.totalPages = data.totalPages;
            this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          })
        ));
      }

      forkJoin(requests).subscribe(results => {
        results.forEach(data => {
          this.products = this.products.concat(data.data);
        });
        this.loadedPages = pagesToLoad;
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        console.error('Error loading products', error);
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onPageSizeChange(size: any): void {
    this.pageSize = Number(size.target.value);
    this.currentPage = 1;
    this.loadedPages = 0;
    this.products = [];
    this.loadProducts();
  }

  editProduct(editableProduct: Product){
    this.productService.getProduct(editableProduct.id).subscribe({
      next: (product) => {
        this.router.navigate(['/edit-product', editableProduct.id]);
      },
      error: (response) => {
        console.log(response)
      }
    })
  }

  deleteProduct(deletableProduct: Product){
    this.productService.deleteProduct(deletableProduct).subscribe({
      next: (product) => {
       this.ngOnInit(); 
      },
      error: (response) => {
        console.log(response)
      }
    })
  }

  sort(field: string): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.loadedPages = 0;
    this.products = [];
    this.loadProducts();
  }
}
