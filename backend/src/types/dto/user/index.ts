export interface CreateUserRepositoryDto {
  email: string;
  password: string;
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateUserServiceDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_picture?: string;
}

export interface LoginUserServiceDto {
  email: string;
  password: string;
}