import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product.model';
import { ProductsService } from 'src/app/services/products.service';
import { forkJoin } from 'rxjs';
import { debounceTime, switchMap, filter, distinctUntilChanged, tap, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Chip } from 'src/app/models/Chip.model';

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
  sortDirection: string = '';
  showMenu: boolean = false;
  selectedPageSize: number = this.pageSize;
  searchActionType: string = 'search';
  showSuggestionsFlag = false;
  searchControl = new FormControl();
  suggestions: string[] = [];
  formattedSuggestions: { value: string, html: SafeHtml }[] = [];
  selectedProduct: Product | null = null;
  searchTerm: string = '';
  chips : Chip[] =[];

  constructor(private productService: ProductsService, private router: Router, private sanitizer: DomSanitizer) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(value => value.trim()),
      tap(value => {
        if (!value || value.length === 0) {
          this.suggestions = [];
          this.formattedSuggestions = [];
        }
      }),
      filter(value => value && value.length > 0),
      switchMap(value => this.productService.getSuggestions(value))
    ).subscribe(suggestions => {
      this.suggestions = suggestions.length ? suggestions : ['No Product'];
      this.updateFormattedSuggestions();
    });
  }
  
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
        requests.push(this.productService.getProducts(i, this.pageSize, this.sortBy, this.sortDirection, this.searchTerm).pipe(
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
    this.pageSize = Number(size);
    this.tableRefresher();
  }

  editProduct(editableProduct: Product){
    this.productService.getProduct(editableProduct.id).subscribe({
      next: (product) => {
        this.router.navigate(['/edit-product', editableProduct.id]);
      },
      error: (response) => {
        console.log(response);
      }
    })
  }

  deleteProduct(deletableProduct: Product){
    this.productService.deleteProduct(deletableProduct).subscribe({
      next: (product) => {
        this.tableRefresher();
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  sort(field: string): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
    this.tableRefresher();
  }

  tableRefresher(){
    this.currentPage = 1;
    this.loadedPages = 0;
    this.products = [];
    this.loadProducts();
  }

  toggleDropdown() {
    this.showMenu = !this.showMenu;
  }

  selectPageSize(size: number) {
    this.pageSize = size;
    this.selectedPageSize = size;
    this.showMenu = false;
    this.onPageSizeChange(size);
  }

  private updateFormattedSuggestions(): void {
    const searchTerm = this.searchControl.value.trim().toLowerCase();
    this.formattedSuggestions = this.suggestions.map(suggestion => {
      const highlighted = suggestion.replace(new RegExp(searchTerm, 'gi'), match => `<b>${match}</b>`);
      return { value: suggestion, html: this.sanitizer.bypassSecurityTrustHtml(highlighted) };
    });
  }

  onSelectSearchItem(value: any) {
    this.searchTerm = value;
    this.searchControl.setValue(this.searchTerm)
    this.currentPage = 1;
    this.loadedPages = 0;
    this.products = [];
    this.loadProducts();
    this.showSuggestionsFlag = false;
    this.searchActionType = 'close'
    const searchChipIndex = this.chips.findIndex(chip => chip.type === 'search');
    if (searchChipIndex >= 0) {
      this.chips[searchChipIndex] = { name: this.searchTerm, type: 'search' };
    } else {
      this.chips.push({ name: this.searchTerm, type: 'search' });
    }
  }

  showSuggestions() {
    this.showSuggestionsFlag = true;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    this.showSuggestionsFlag = false;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchControl.setValue('');
    this.pageSize = 10;
    // this.tableRefresher();
    this.searchActionType = 'search';
  }

  onInputChange(event: Event){
    if (this.searchControl.value.length !== 0){
      this.searchActionType = 'close'
    }
  }

  removeChip(chip: Chip): void {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
      this.clearSearch();
      this.tableRefresher();
    }
  }
}
