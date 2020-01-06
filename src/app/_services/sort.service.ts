import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() { }

  /**
  *  Sort by Name
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

  /**
  *  Sort by FirstName
  * @param a
  * @param b
  */
  public sortByFirstName(a: any, b: any): number {
    if (a.firstname < b.firstname) {
      return -1;
    }

    if (a.firstname > b.firstname) {
      return 1;
    }

    return 0;
  }

  /**
    *  Sort by LastName
    * @param a
    * @param b
    */
  public sortByLastName(a: any, b: any): number {
    if (a.lastname < b.lastname) {
      return -1;
    }

    if (a.lastname > b.lastname) {
      return 1;
    }

    return 0;
  }
}
