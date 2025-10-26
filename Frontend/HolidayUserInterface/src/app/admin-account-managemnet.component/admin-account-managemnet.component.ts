import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/auth';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin-account-managemnet.component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-account-managemnet.component.html',
  styleUrl: './admin-account-managemnet.component.css'
})
export class AdminAccountManagemnetComponent {

  users: User[] = [];


  constructor(private authService: AuthService) {}


  fetchAllUsers(): void {
    this.authService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  updateUser(user: User): void {
    console.log('Update user:', user);
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user: ${user.email}?`)) {
      console.log('Delete user:', user);
    }
  }

  ngOnInit(): void {
    this.fetchAllUsers();
  }
}
