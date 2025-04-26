
export interface CreateProfileDto {
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  profile_picture?: string;
  createdAt?: Date
  updatedAt?: Date
}