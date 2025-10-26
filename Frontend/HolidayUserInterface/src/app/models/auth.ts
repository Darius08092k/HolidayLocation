export interface LoginDTO
{
  email: string;
  password: string;
}

export interface RegisterDTO
{
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  message?: string;
}

export interface User {
  id?: string;
  email: string;
  roles: string[];
}
