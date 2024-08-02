import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AuthComponent } from './components/auth/auth.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/add', component: AddProductComponent },
  { path: 'edit-product/:id', component: AddProductComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
