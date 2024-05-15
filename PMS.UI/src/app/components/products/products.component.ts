import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [
    {
      id: "001",
      name: 'T-shirt',
      type: 'Garment',
      color: 'Blue',
      price: '9.99',
    },
    {
      id: "002",
      name: 'Samsung',
      type: 'Tech Inc',
      color: 'Black',
      price: '550.50',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
