import { Component } from '@angular/core';
import { Brand } from 'src/app/models/brands';
import { BrandsService } from 'src/app/services/brands.service';
import { CurrentBrandService } from 'src/app/services/current-brand.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
    
  brands : Brand[] = [];  

  constructor(private brandsService : BrandsService, 
              private currentBrandService: CurrentBrandService){}

  ngOnInit() {
    this.load();
  }

  load(){
    this.brandsService.getBrands().subscribe(data => {
      this.brands = data;
    });
  }
  
}
