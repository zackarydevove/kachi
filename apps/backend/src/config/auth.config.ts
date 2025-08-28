const authConfig = {
  secret: process.env.AUTH_SECRET_KEY as string,
  secret_expires_in: process.env.AUTH_SECRET_EXPIRES_IN as string,
  refresh_secret: process.env.AUTH_REFRESH_SECRET_KEY as string,
  refresh_secret_expires_in: process.env
    .AUTH_REFRESH_SECRET_EXPIRES_IN as string,
  reset_password_secret: process.env.AUTH_RESET_PASSWORD_SECRET_KEY as string,
  reset_password_secret_expires_in: process.env
    .AUTH_RESET_PASSWORD_SECRET_EXPIRES_IN as string,
};

export default authConfig;
