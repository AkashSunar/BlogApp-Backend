import prisma from "../../DB/db.config";
import {
  createUser,
  getAllUser,
  getUserByid,
  blockUser,
  deleteUser,
} from "../../modules/user/user.controller";
import bcrypt from "bcrypt";
import { Role, User } from "@prisma/client";

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

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

const testUsers = [
  {
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
  },
  {
    id: 4,
    name: "Aasman Suar",
    username: "Aasman",
    email: "Aasman@test.com",
    passwordHash: "hashedPassword",
    isEmailVerified: true,
    isActive: true,
    isArchive: false,
    role: "USER" as Role,
    image: "1708922438402-DSCN9315.JPG",
    created_by: 0,
    updated_by: 0,
  },
];

describe("User Controller Testing", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  beforeEach(() => {
    jest.clearAllMocks(); //so that we need not to acll in every functions
  });
  describe("create a user", () => {
    it("should sign up a user", async () => {
      //   jest.clearAllMocks();
      const signupData = {
        name: "Akash Sunar",
        username: "Aakhu",
        email: "aakhu@test.com",
        image: "1708922438402-DSCN9313.JPG",
        password: "11111111",
      };

      jest.spyOn(prisma.user, "create").mockResolvedValue(expectedResult);
      const result = await createUser(signupData);
      expect(bcrypt.hash).toHaveBeenCalledWith(signupData.password, 10); //here 10 is passed as a argument for saltRounds for bcrypt.hash()
      expect(result.passwordHash).toEqual(expectedResult.passwordHash);
      expect(result.email).toEqual(expectedResult.email);
      expect(signupData.image).toBeDefined();
    });
  });

  describe("Get a single blog", () => {
    it("should returns a blog by id", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(expectedResult);
      const user = await getUserByid(expectedResult.id);
      //   console.log(user);
      expect(user).toBeDefined();
      expect(user).toEqual(expectedResult);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: expectedResult.id },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          role: true,
          image: true,
        },
      });
    });
  });

  describe("Get all blogs", () => {
    it("should returns all blogs", async () => {
      jest.spyOn(prisma.user, "findMany").mockResolvedValue(testUsers);
      const allUser = await getAllUser();
      expect(allUser).toBeDefined();
      expect(allUser).toEqual(testUsers);
    });
  });

  describe("Block a user ", () => {
    it("should block the user of that id", async () => {
      //   const body = { isActive: false };
      const blockingData = {
        isActive: false,
      };
      jest.spyOn(prisma.user, "update").mockResolvedValue(blockingData as User); //to pass only {isActive:false} otherwise it wants all the field
      const blockedUser = await blockUser(
        expectedResult.id,
        blockingData as User
      );
      expect(blockedUser).toEqual(blockingData);
      expect(blockedUser.isActive).toEqual(false);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: expectedResult.id,
        },
        data: blockingData,
      });
    });
  });

  describe("Delete a user", () => {
    it("should delete the user of that id", async () => {
      const deletingData = { isArchive: true };
      jest.spyOn(prisma.user, "update").mockResolvedValue(deletingData as User); //to pass only {isActive:false} otherwise it wants(expects) all the fields
      const deletedUser = await deleteUser(
        expectedResult.id,
        deletingData as User
      );
      expect(deletedUser).toEqual(deletingData);
      expect(deletedUser.isArchive).toEqual(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: expectedResult.id,
        },
        data: deletingData,
      });
    });
  });
});
