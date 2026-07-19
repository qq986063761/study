export type UserStatus = 0 | 1;

export type UserInput = {
  username: string;
  email: string;
  age: number;
  status: UserStatus;
};
