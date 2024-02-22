export interface User {
  id?: number;
  username: string;
  name: string;
  email: string;
  password: string;
  image: string;
  role: Role;
}

enum Role {
  USER,
  ADMIN,
}
