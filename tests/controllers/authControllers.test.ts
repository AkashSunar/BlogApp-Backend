import prisma from "../../DB/db.config";
import {
  createUser,
  verify,
  //   login,
  //   forgetPasswordtoken,
  //   changePasswordToken,
  //   forgotPassword,
  //   changePassword,
} from "../../modules/auth/auth.controllers";
import bcrypt from "bcrypt";
import * as OTP from "../../utils/otp";
import { Role, Auth, User } from "@prisma/client";
import { mailer } from "../../services/mailer";
// import * as JWT from "../../utils/jwt";

jest.mock("../../utils/otp", () => ({
  generateOTP: jest.fn(() => 111111),
  verifyOTP: jest.fn(),
}));

jest.mock("../../utils/jwt", () => ({
  signJwt: jest.fn().mockResolvedValue("jwtToken"),
  verifyJwt: jest.fn(),
}));
jest.mock("../../services/mailer", () => ({
  mailer: jest.fn(() => "example@email.com"),
}));
const signupData = {
  name: "Akash Sunar",
  username: "Aakhu",
  email: "aakhu@test.com",
  image: "1708922438402-DSCN9313.JPG",
  password: "11111111",
};

const expectedResult = {
  id: 5,
  name: "Akash Suar",
  username: "Aakhu",
  email: "aakhu@test.com",
  passwordHash: "hashedPassword",
  isEmailVerified: true,
  isActive: true,
  isArchive: false,
  role: "USER" as Role,
  image: "1708922438402-DSCN9314.JPG",
  created_by: 0,
  updated_by: 0,
};
const authUser = {
  email: expectedResult.email,
  otpToken: 111111,
};
describe("Auth controller testing", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("create a user", () => {
    it("should sign up a user", async () => {
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword" as never);
      jest.spyOn(OTP, "generateOTP").mockReturnValue("111111");
      jest.spyOn(prisma.user, "create").mockResolvedValue(expectedResult);
      jest.spyOn(prisma.auth, "create").mockResolvedValue(authUser as Auth);
      const result = await createUser(signupData);
      expect(result).toEqual(expectedResult);
      expect(bcrypt.hash).toHaveBeenCalledWith(signupData.password, 10);
      expect(OTP.generateOTP).toHaveBeenCalledWith();
      const createdAuth = await prisma.auth.create({ data: authUser });
      expect(createdAuth).toEqual(authUser);
      expect(mailer).toHaveBeenCalledWith("aakhu@test.com", 111111);
    });
  });

  describe("User verification ", () => {
    it("should verify user", async () => {
      // jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedpassword" as never);

      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as Auth);
      jest.spyOn(prisma.auth, "delete").mockResolvedValue(authUser as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      jest
        .spyOn(prisma.user, "update")
        .mockResolvedValue({ isEmailVerified: true } as User);
      const verifiedUser = await verify(authUser);
      expect(verifiedUser).toBe(true);
      expect(OTP.verifyOTP).toHaveBeenCalledWith(String(authUser.otpToken));
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: {
          email: authUser.email,
        },
      });
    });
    it("should throw an error if user is not available", async () => {
      const authPayload = {
        email: "ivalidemail@test.com",
        otpToken: 333333, //incorrect OTP token
      };
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(null);
      const verifiedUser = await verify(authPayload);
      console.log(verifiedUser, "from user valid test");
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: {
          email: authPayload.email,
        },
      });
      await expect(verifiedUser).rejects.toThrow("user is not available");
    });
    it("should throw an error if otpToken is expired", async () => {
      const authPayload = {
        email: "ivalidemail@test.com",
        otpToken: 222222, //incorrect OTP token
      };
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue({
        email: authPayload.email,
        otpToken: authPayload.otpToken,
      } as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(false);
      const verifiedUser = await verify(authPayload);
      console.log(verifiedUser, "from token valid test");
      await expect(verifiedUser).rejects.toThrow("token is expired");
      expect(OTP.verifyOTP).toHaveBeenCalledWith(String(authPayload.otpToken));
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: authPayload.email },
      });
    });
  });
});
