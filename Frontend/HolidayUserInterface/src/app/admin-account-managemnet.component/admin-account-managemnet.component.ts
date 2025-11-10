import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/auth';
import { AuthService } from '../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-account-managemnet.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-account-managemnet.component.html',
  styleUrl: './admin-account-managemnet.component.css'
})
export class AdminAccountManagemnetComponent {

  users: User[] = [];
  selectedUser: User | null = null;
  isEditModalVisible: boolean = false;

  // Edit form fields
  editEmail: string = '';
  editUserName: string = '';
  editPhoneNumber: string = '';
  editRoles: string = '';

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

  openEditModal(user: User): void {
    this.selectedUser = { ...user }; // Create a copy to avoid direct mutation
    this.editEmail = user.email;
    this.editUserName = user.userName || '';
    this.editPhoneNumber = user.phoneNumber || '';
    this.editRoles = user.roles.join(', ');
    this.isEditModalVisible = true;
  }

  closeEditModal(): void {
    this.isEditModalVisible = false;
    this.selectedUser = null;
    this.editEmail = '';
    this.editUserName = '';
    this.editPhoneNumber = '';
    this.editRoles = '';
  }

  saveUser(): void {
    if (!this.selectedUser) return;

    const rolesArray = this.editRoles.split(',').map(role => role.trim()).filter(role => role.length > 0);

    this.authService.updateUser(
      this.selectedUser.id!,
      this.editEmail,
      this.editUserName,
      this.editPhoneNumber,
      rolesArray
    ).subscribe(
      () => {
        console.log('User updated successfully');
        this.closeEditModal();
        this.fetchAllUsers(); // Refresh the user list
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user: ${user.email}?`)) {
      this.authService.deleteUser(user.id!).subscribe(
        () => {
          console.log('User deleted successfully');
          this.fetchAllUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.fetchAllUsers();
  }
}
