import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { IChecklist } from '../_models/ichecklist';
import { MemberService } from '../_firebases/member.service';

@Injectable()
export class ChecklistResolver implements Resolve<IChecklist> {

  constructor(
    private router: Router,
    private memberService: MemberService) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<IChecklist> {
    const id = route.paramMap.get('id');
    console.log('resolver', id);

    if (id === environment.NewEntityURLParameters.NewChecklist) {
      return of({ id: 0 } as IChecklist);
    }
    // else {
    //   if (Number(id) === NaN || Number(id) === 0) {
    //     this.router.navigate(['/notfound']);
    //   }

    //   // tslint:disable-next-line:max-line-length
    //   return this.memberService.getMember(id);
    // }
  }
}
