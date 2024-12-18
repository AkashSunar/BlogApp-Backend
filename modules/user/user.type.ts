export interface UserType {
  id?: number;
  username: string;
  name: string;
  email: string;
  passwordHash?: string;
  image: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isArchive: boolean;
  role?: Role;
  updated_by?: number;
  created_by?: number;
  blogs: number[];
}
enum Role {
  "USER",
  "ADMIN",
}
export interface UserReturnType {
  email: string;
  accessToken: string;
  refreshToken: string;
}
