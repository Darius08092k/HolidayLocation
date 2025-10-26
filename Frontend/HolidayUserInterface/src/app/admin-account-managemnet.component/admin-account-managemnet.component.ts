import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../Models/user';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin-account-managemnet.component',
  imports: [CommonModule],
  templateUrl: './admin-account-managemnet.component.html',
  styleUrl: './admin-account-managemnet.component.css'
})
export class AdminAccountManagemnetComponent {

  users: User[] = [];


  constructor(private authService: AuthService) {}


  fetchAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchAllUsers();
  }
}
