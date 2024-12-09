export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string; // Optional field for user's avatar
    auth_token?: string; // Optional field for JWT token or similar authentication token
    role?: string; // Optional field to define user roles or permissions
  };
  