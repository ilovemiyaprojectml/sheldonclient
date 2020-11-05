import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class TitleBlinkerService {

  private timeout;


  constructor(private title: Title){

  }


  blink(msg: string, count: number = 5): void {
    const prevTitle = this.title.getTitle();

    const step = () => {
      const newTitle = this.title.getTitle() === prevTitle ?
        msg : prevTitle;

      this.title.setTitle(newTitle);

      if (--count) {
        this.timeout = setTimeout(step.bind(this), 3000);
      } else {
        this.title.setTitle(prevTitle);
      }
    };

    clearTimeout(this.timeout);
    step();
  }

  stop(){
    clearTimeout(this.timeout);
  }


}
