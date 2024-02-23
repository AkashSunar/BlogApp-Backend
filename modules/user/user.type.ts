export interface UserType {
  id?: number;
  username: string;
  name: string;
  email: string;
  passwordHash?: string;
  image: string;
  role: Role;
}
enum Role {
  "USER",
  "ADMIN",
}
export interface UserReturnType {
  email: string;
  token: string;
}
