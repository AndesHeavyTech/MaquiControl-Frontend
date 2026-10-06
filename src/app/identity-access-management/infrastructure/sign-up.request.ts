export interface SignUpRequest {
  email: string;
  credential: {
    passwordHash: string;
    changedAt: string;
  };
  status: string;
  roleIds: number[];
  createdAt: string;
  lastLoginAt: string | null;
}
