import Jwt from "jsonwebtoken";
// const refreshTokensecret = process.env.REFRESH_TOKEN_SECRET;
const tokenSecret = process.env.SECRET;

export const verifyJwt = (token: string) => {
  try {
    const decoded = Jwt.verify(token, tokenSecret || "");
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    console.error(error);
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};

export const signJwt = (payload: any) => {
  return Jwt.sign(payload, tokenSecret || "", { expiresIn: "3m" });
};
