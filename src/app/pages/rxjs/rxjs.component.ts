import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {
    // const obs$ = new Observable(observer => {
    //   setInterval(() => {
    //     console.log('tick');
    //   }, 1000)
    // });
    // obs$.subscribe();

    // const obs$ = new Observable(observer => {
    //   let i = -1;
    //   setInterval(() => {
    //     i++;
    //     observer.next(i);
    //   }, 1000)
    // });
    // obs$.subscribe(
    //   valor => console.log('Subs: ', valor)
    // );

    // const obs$ = new Observable(observer => {
    //   let i = -1;
    //   const intervalo = setInterval(() => {
    //     i++;
    //     observer.next(i);
    //     if (i === 4) {
    //       clearInterval(intervalo);
    //       observer.complete();
    //     }
    //     if (i === 2) {
    //       observer.error('i llego al valor de 2');
    //     }
    //     //console.log('tick');
    //   }, 1000)
    // });

    // obs$.subscribe(
    //   valor => console.log('Subs: ', valor),
    //   error => console.warn('Error:', error),
    //   () => console.info('Obs terminado')
    // );

    //   //let i = -1;
    //   const obs$ = new Observable(observer => {
    //     let i = -1;
    //     const intervalo = setInterval(() => {
    //       i++;
    //       observer.next(i);
    //       if (i === 4) {
    //         clearInterval(intervalo);
    //         observer.complete();
    //       }
    //       if (i === 2) {
    //         i = 0;
    //         //console.log('i = 2.... error');
    //         observer.error('i llego al valor de 2');
    //       }
    //       //console.log('tick');
    //     }, 1000)
    //   });

    //   obs$.pipe(
    //     retry(1)
    //   ).subscribe(
    //     valor => console.log('Subs: ', valor),
    //     error => console.warn('Error:', error),
    //     () => console.info('Obs terminado')
    //   );
    // }

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subs: ', valor),
    //   error => console.warn('Error:', error),
    //   () => console.info('Obs terminado')
    // );

    this.intervalSubs = this.retornaIntervalo().subscribe((valor) => console.log(valor))
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    const intervalo$ = interval(300)
      .pipe(
        //take(10),
        map(valor => valor + 1),
        filter(valor => (valor % 2 === 0) ? true : false),
      );
    return intervalo$;
  }

  retornaObservable(): Observable<number> {
    let i = -1;
    const obs$ = new Observable<number>(observer => {

      const intervalo = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }
        if (i === 2) {
          console.log('i = 2.... error');
          observer.error('i llego al valor de 2');
        }
        //console.log('tick');
      }, 1000)
    });
    return obs$;
  }

}
