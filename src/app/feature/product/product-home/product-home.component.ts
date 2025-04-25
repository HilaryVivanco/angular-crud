import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SaveProductDlgComponent } from '../save-product-dlg/save-product-dlg.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-home',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.scss']
})
export class ProductHomeComponent implements OnInit {
  columns: string[] = ['image', 'name', 'description', 'currency', 'price', 'state', 'action'];
  allProducts: Product[] = [];       // Todos los productos sin filtrar
  dataSource: Product[] = [];        // Productos filtrados que se muestran
  nombreFiltro: string = '';
  estadoFiltro: string = '';

  productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.productService.getAll().subscribe(res => {
      this.allProducts = res.data;
      this.dataSource = this.applyFilters(this.allProducts);
    });
  }

  onFiltroChange(): void {
    this.dataSource = this.applyFilters(this.allProducts);
  }

  applyFilters(products: Product[]): Product[] {
    return products.filter(product => {
      const coincideNombre = product.name.toLowerCase().includes(this.nombreFiltro.toLowerCase());
      const coincideEstado = this.estadoFiltro === '' ||
        product.state.toString().toLowerCase() === this.estadoFiltro.toLowerCase();
      return coincideNombre && coincideEstado;
    });
  }

  openProductDlg(product?: Product): void {
    const dialogRef = this.dialog.open(SaveProductDlgComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getAll();
      }
    });
  }

  inactiveProduct(id: number): void {
    this.productService.inactive(id).subscribe(res => {
      if (res.status) {
        this.getAll();
        this.snackbar.open('Se inactivó el producto', 'Aceptar');
      }
    });
  }
}
