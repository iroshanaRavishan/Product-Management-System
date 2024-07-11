import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Product } from 'src/app/models/Product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  constructor( private productService: ProductsService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe( {
       next: (products) => {
        this.products = products
       },
       error: (reponse) => {
        console.log(reponse)
       }
    })
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

}
