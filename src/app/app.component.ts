import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'loading...';
  testo2:string;
  message: string = "hello world";
  

  constructor() {
    setTimeout(() => {
      const NOME = 'Loaded'
      this.title = NOME;
    
    }, 5000);
  }

  getClick(event) {
    console.log(event);
  }
  getText(event) {
    console.log(event.target.value);

  }
  getInput(input) {
    console.log(input.value);

  }
}
