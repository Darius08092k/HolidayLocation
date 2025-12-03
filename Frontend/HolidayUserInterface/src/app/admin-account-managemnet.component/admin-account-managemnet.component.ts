import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../models/auth';
import { AuthService } from '../services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-account-managemnet.component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-account-managemnet.component.html',
  styleUrl: './admin-account-managemnet.component.css'
})
export class AdminAccountManagemnetComponent {

  users: User[] = [];
  selectedUser: User | null = null;
  isEditModalVisible: boolean = false;
  isCreateModalVisible: boolean = false;

  // Edit form fields
  editEmail: string = '';
  editUserName: string = '';
  editPhoneNumber: string = '';
  editRoles: string = '';

  // Create form fields
  newEmail: string = '';
  newPassword: string = '';
  newPhoneNumber: string = '';
  newUserName: string = '';
  newRoles: string = 'User'; // Default to User role

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

  openCreateModal(): void {
    // Reset form fields
    this.newEmail = '';
    this.newPassword = '';
    this.newPhoneNumber = '';
    this.newUserName = '';
    this.newRoles = 'User';
    this.isCreateModalVisible = true;
  }

  closeCreateModal(): void {
    this.isCreateModalVisible = false;
    this.newUserName = '';
    this.newEmail = '';
    this.newPassword = '';
    this.newPhoneNumber = '';
    this.newRoles = 'User';
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

  createUser(): void {
    this.authService.createUser(this.newEmail, this.newPassword, this.newRoles).subscribe(
      (response: any) => {
        console.log('User created successfully');
        // After creating the user, we need to update with phone number and username
        // First, we need to get the user ID by fetching all users again
        this.authService.getAllUsers().subscribe(
          (users: User[]) => {
            // Find the newly created user
            const newUser = users.find(u => u.email === this.newEmail);
            if (newUser && newUser.id) {
              // Update the user with phone number and username
              const rolesArray = this.newRoles.split(',').map(role => role.trim()).filter(role => role.length > 0);
              this.authService.updateUser(
                newUser.id,
                this.newEmail,
                this.newUserName,
                this.newPhoneNumber,
                rolesArray
              ).subscribe(
                () => {
                  console.log('User updated with phone number and username');
                  this.closeCreateModal();
                  this.fetchAllUsers(); // Refresh the user list
                },
                (error) => {
                  console.error('Error updating user with phone number and username:', error);
                  this.closeCreateModal();
                  this.fetchAllUsers(); // Still close and refresh, as the user was created
                }
              );
            } else {
              this.closeCreateModal();
              this.fetchAllUsers(); // Close and refresh
            }
          },
          (error) => {
            console.error('Error fetching users after creation:', error);
            this.closeCreateModal();
            this.fetchAllUsers(); // Close and refresh
          }
        );
      },
      (error) => {
        console.error('Error creating user:', error);
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
