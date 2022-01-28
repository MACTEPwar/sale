export type TUser = {
  name?: string;
  username?: string;
  password?: string;
  access_token?: string;
  refresh_token?: string;
  isAdmin?: boolean;
  settings?: TSettings;
};

export type TSettings = {
  keyboardType?: string;
};
