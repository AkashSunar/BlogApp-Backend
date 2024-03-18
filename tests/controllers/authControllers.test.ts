import prisma from "../../DB/db.config";
import {
  createUser,
  verify,
  login,
  forgetPasswordtoken,
  forgotPassword,
  changePassword,
} from "../../modules/auth/auth.controllers";
import bcrypt from "bcrypt";
import * as OTP from "../../utils/otp";
import { Role, Auth, User } from "@prisma/client";
import { mailer } from "../../services/mailer";
import jwt from "jsonwebtoken";

jest.mock("../../utils/otp", () => ({
  generateOTP: jest.fn(() => 111111),
  verifyOTP: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("yourToken"),
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
        otpToken: 222222, //incorrect OTP token
      };
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(null);
      const verifiedUser = verify(authPayload);
      //   console.log(verifiedUser, "from user valid test");

      await expect(verifiedUser).rejects.toThrow("user is not available");
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: {
          email: authPayload.email,
        },
      });
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
      const verifiedUser = verify(authPayload);
      //   console.log(verifiedUser, "from token valid test");
      await expect(verifiedUser).rejects.toThrow("token is expired");
      expect(OTP.verifyOTP).toHaveBeenCalledWith(String(authPayload.otpToken));
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: authPayload.email },
      });
    });

    it("should throw an error if token is mismatched", async () => {
      const authPayload = {
        email: "ivalidemail@test.com",
        otpToken: 222222, //incorrect OTP token || different OTP token
      };
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue({
        email: "invalidemail@test.com",
        otpToken: 333333,
      } as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      const verifiedUser = verify(authPayload);
      await expect(verifiedUser).rejects.toThrow("there is problem in token");
      expect(OTP.verifyOTP).toHaveBeenCalledWith(String(authPayload.otpToken));
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: {
          email: authPayload.email,
        },
      });
    });
  });

  describe("User Login testing", () => {
    it("should make user login and give JWT token", async () => {
      const loginData = {
        email: "loginData@test.com",
        password: "22222222",
      };
      const jwtPayload = {
        email: loginData.email,
        id: 1,
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(expectedResult);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      await login(loginData.email, loginData.password);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: loginData.email,
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        "hashedPassword"
      );
      const receivedToken = jwt.sign(jwtPayload, process.env.SECRET || "", {
        expiresIn: "3m",
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        jwtPayload,
        process.env.SECRET || "",
        { expiresIn: "3m" }
      );
      expect(receivedToken).toEqual("yourToken");
    });

    it("should throw error if user not found", async () => {
      const loginData = {
        email: "wrongdata@test.com",
        password: "22222222",
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
      const loginProcess = login(loginData.email, loginData.password);
      await expect(loginProcess).rejects.toThrow("user not found");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: loginData.email,
        },
      });
    });

    it("should throw error if user is not verified", async () => {
      const testUser = {
        id: 5,
        name: "Akash Suar",
        username: "Aakhu",
        email: "aakhu@test.com",
        passwordHash: "hashedPassword",
        isEmailVerified: false,
        isActive: true,
        isArchive: false,
        role: "USER" as Role,
        image: "1708922438402-DSCN9314.JPG",
        created_by: 0,
        updated_by: 0,
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(testUser);
      const loginProcess = login(testUser.email, "22222222");
      await expect(loginProcess).rejects.toThrow("Email is not verified");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: testUser.email,
        },
      });
    });

    it("should throw error if user is not active", async () => {
      const testUser = {
        id: 5,
        name: "Akash Suar",
        username: "Aakhu",
        email: "aakhu@test.com",
        passwordHash: "hashedPassword",
        isEmailVerified: true,
        isActive: false,
        isArchive: false,
        role: "USER" as Role,
        image: "1708922438402-DSCN9314.JPG",
        created_by: 0,
        updated_by: 0,
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(testUser);
      const loginProcess = login(testUser.email, "22222222");
      await expect(loginProcess).rejects.toThrow("Email is not active yet");

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: testUser.email,
        },
      });
    });

    it("should throw error if invalid email or password is provided ", async () => {
      const loginData = {
        email: "wrongdata@test.com", //wrong email
        password: "22222222", //wromg password
      };
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(expectedResult);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);
      const loginProcess = login(loginData.email, loginData.password);
      await expect(loginProcess).rejects.toThrow("Invalid email or password");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        expectedResult.passwordHash
      );
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: loginData.email,
        },
      });
    });
  });

  describe("Generate  forgotpassword token", () => {
    it("should generate forgotPassword token", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(expectedResult);
      jest.spyOn(OTP, "generateOTP").mockReturnValue("111111");
      jest.spyOn(prisma.auth, "create").mockResolvedValue(authUser as Auth);
      const result = await forgetPasswordtoken(expectedResult.email);
      expect(result).toBe(true);
      expect(OTP.generateOTP()).toEqual("111111");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: expectedResult.email,
        },
      });
      expect(prisma.auth.create).toHaveBeenCalledWith({
        data: authUser,
      });
      expect(OTP.generateOTP).toHaveBeenCalled();
      expect(mailer).toHaveBeenCalledWith(authUser.email, 111111);
    });

    it("shouldthrow an error if user is not found", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);
      const result = forgetPasswordtoken(expectedResult.email);
      await expect(result).rejects.toThrow("user doesn't exist");
      expect(prisma.user.findUnique).toHaveBeenLastCalledWith({
        where: {
          email: expectedResult.email,
        },
      });
    });
  });

  describe("Forgot password testing", () => {
    const forgotPasswordPayload = {
      email: "aakhu@test.com", //this  data is used in all test case of forgot passeord testing
      otpToken: 111111,
      password: "newPassword",
    };
    it("should handle forgot password", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as Auth);
      jest
        .spyOn(bcrypt, "hash")
        .mockResolvedValue("newHashedPassword" as never);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      jest.spyOn(prisma.user, "update").mockResolvedValue(expectedResult);
      jest.spyOn(prisma.auth, "delete").mockResolvedValue(authUser as Auth);
      const result = await forgotPassword(
        forgotPasswordPayload.email,
        forgotPasswordPayload.otpToken,
        forgotPasswordPayload.password
      );
      expect(result).toBe(true);
      expect(OTP.verifyOTP).toHaveBeenCalled();
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: forgotPasswordPayload.email },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          email: forgotPasswordPayload.email,
        },
        data: {
          passwordHash: "newHashedPassword",
        },
      });
      expect(prisma.auth.delete).toHaveBeenLastCalledWith({
        where: {
          email: forgotPasswordPayload.email,
        },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(
        forgotPasswordPayload.password,
        10
      );
    });
    it("should throw error if user is not found", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(null);
      const result = forgotPassword(
        forgotPasswordPayload.email,
        forgotPasswordPayload.otpToken,
        forgotPasswordPayload.password
      );
      await expect(result).rejects.toThrow("user doesn't exist");
      expect(prisma.auth.findUnique).toHaveBeenLastCalledWith({
        where: {
          email: forgotPasswordPayload.email,
        },
      });
    });

    it("should throw error if otpToken is not valid", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(false);
      const result = forgotPassword(
        forgotPasswordPayload.email,
        forgotPasswordPayload.otpToken,
        forgotPasswordPayload.password
      );
      await expect(result).rejects.toThrow("provided otp token is not valid");
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: {
          email: forgotPasswordPayload.email,
        },
      });
      expect(OTP.verifyOTP).toHaveBeenCalled();
    });

    it("should throw error if token is mismatched ", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue({
        email: "aakhu@test.com",
        otpToken: 333333,
      } as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      const result = forgotPassword(
        forgotPasswordPayload.email,
        forgotPasswordPayload.otpToken,
        forgotPasswordPayload.password
      );
      await expect(result).rejects.toThrow("there is problem in token"); //token mismatched
      expect(OTP.verifyOTP).toHaveBeenCalledWith(
        String(forgotPasswordPayload.otpToken)
      );
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: forgotPasswordPayload.email },
      });
    });
  });

  describe(" Change password testing", () => {
    const changePasswordPayload = {
      email: "aakhu@test.com",
      otpToken: 111111,
      oldPassword: "oldPassword",
      newPassword: "newPassword",
    };
    it("should handle change password", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as Auth);
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(expectedResult);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      jest
        .spyOn(bcrypt, "hash")
        .mockResolvedValue("newHashedPassword" as never);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      jest.spyOn(prisma.user, "update").mockResolvedValue(expectedResult);
      const result = await changePassword(
        changePasswordPayload.email,
        changePasswordPayload.otpToken,
        changePasswordPayload.oldPassword,
        changePasswordPayload.newPassword
      );
      expect(result).toBe(true);
      expect(OTP.verifyOTP).toHaveBeenCalled();
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          email: changePasswordPayload.email,
        },
        data: {
          passwordHash: "newHashedPassword",
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        changePasswordPayload.oldPassword,
        "hashedPassword"
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(
        changePasswordPayload.newPassword,
        10
      );
    });

    it("should throw error  if auth user doesn't exist", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(null);
      const result = changePassword(
        changePasswordPayload.email,
        changePasswordPayload.otpToken,
        changePasswordPayload.oldPassword,
        changePasswordPayload.newPassword
      );
      await expect(result).rejects.toThrow("auth user doesn't exist");
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
    });

    it("should throw error if provided token is not valid", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(false);
      const result = changePassword(
        changePasswordPayload.email,
        changePasswordPayload.otpToken,
        changePasswordPayload.oldPassword,
        changePasswordPayload.newPassword
      );
      await expect(result).rejects.toThrow("provided otp token is not valid");
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
      expect(OTP.verifyOTP).toHaveBeenCalled();
    });

    it("should throw error if email is not valid", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue({
        email: "aakhu@test.com",
        otpToken: 333333,
      } as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      const result = changePassword(
        changePasswordPayload.email,
        changePasswordPayload.otpToken,
        changePasswordPayload.oldPassword,
        changePasswordPayload.newPassword
      );
      await expect(result).rejects.toThrow("email is not valid");
      expect(OTP.verifyOTP).toHaveBeenCalled();
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
    });

    it("should throw error if user is not found", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as Auth);
      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      const result = changePassword(
        changePasswordPayload.email,
        changePasswordPayload.otpToken,
        changePasswordPayload.oldPassword,
        changePasswordPayload.newPassword
      );
      await expect(result).rejects.toThrow("user not found");
      expect(OTP.verifyOTP).toHaveBeenCalled();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
    });

    it("should throw an error if old password is incorrect", async () => {
      jest.spyOn(prisma.auth, "findUnique").mockResolvedValue(authUser as Auth);

      jest.spyOn(OTP, "verifyOTP").mockReturnValue(true);
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(expectedResult);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);
      const result = changePassword(
        changePasswordPayload.email,
        changePasswordPayload.otpToken,
        changePasswordPayload.oldPassword,
        changePasswordPayload.newPassword
      );
      await expect(result).rejects.toThrow(
        "old password you provided is incorrect"
      );
      expect(OTP.verifyOTP).toHaveBeenCalled();

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
      expect(prisma.auth.findUnique).toHaveBeenCalledWith({
        where: { email: changePasswordPayload.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        changePasswordPayload.oldPassword,
        "hashedPassword"
      );
    });
  });
});
