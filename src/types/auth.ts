import { User } from "./models/User";

export type AuthContextType = {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (userAndToken: { token: string, user: User }) => void;
  logout: () => Promise<void>;
  setUserData: (userData: User) => void;
  getUser: () => User | null;
  isAdmin: boolean;
};
