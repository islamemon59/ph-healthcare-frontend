export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    email: string;
    role: string;
    needPasswordChange: boolean;
    image: string;
    status: string;
    isDeleted: string;
    emailVerified: boolean;
  };
}
