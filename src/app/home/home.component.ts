import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService
    ) { }

  ngOnInit() {
  }
  Logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
