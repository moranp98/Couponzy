import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Directive({
  selector: '[appDesignchart]'
})
export class DesignchartDirective {

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('#eeeeee', true);
  } 

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null, false);
  }

  @HostBinding('style.background')
  public background: SafeStyle;

  private highlight(color: string, toggle: boolean) {
    this.el.nativeElement.style.backgroundColor = color;
    if(toggle){
      this.background = this.sanitizer.bypassSecurityTrustStyle(
        'url("assets/content/chart-6.jpg")'
      );
    }else{
      this.background = this.sanitizer.bypassSecurityTrustStyle(
        'url("assets/content/chart-3.jpg")'
      );
    }
    
  }
  
  constructor(public el: ElementRef, private sanitizer: DomSanitizer) { }

}
