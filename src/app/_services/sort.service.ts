import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() { }

  /**
  *  Sort by FirstName
  * @param a
  * @param b
  */
  public sortByName(a: any, b: any): number {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  }
}
