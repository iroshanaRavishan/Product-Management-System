import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productId!: string | null;
  pageType = 'Add New';
  newProduct: Product = {
    id: '',
    name:'',
    type:'',
    color: '',
    price: 0
  }

  constructor(private route: ActivatedRoute, private productService: ProductsService, private router: Router) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.pageType = 'Update';
      this.productService.getProduct(this.productId).subscribe((product: Product) => {
        this.newProduct= {...product};
      });
    }
  }

  onSubmit(){
    if (this.productId){
      this.productService.updateProduct(this.newProduct).subscribe({
        next: (product) => {
          this.router.navigate(['products'])
        },
        error: (response) => {
          console.log(response)
        }
      });
    } else {
      this.productService.addProduct(this.newProduct).subscribe({
        next: (product) => {
          this.router.navigate(['products'])
        },
        error: (response) => {
          console.log(response)
        }
      });
    } 
  }
}
