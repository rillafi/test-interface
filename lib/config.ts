export const isDev = process.env.NODE_ENV !== "production";
// export const isDev = false;

export const server = isDev
  ? "http://127.0.0.1:3000"
  : "https://app.sch0lar.io";
