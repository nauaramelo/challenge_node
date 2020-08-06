import { UserBusiness } from "../../src/business/UserBusiness";
import { User } from "../../src/model/User";

describe("Testing UserBusiness.signup", () => {
  let userDatabase = {};
  let hashGenerator = {};
  let tokenGenerator = {};
  let idGenerator = {};
  let cpfDatabase = {};

  test("Should return 'Missing input' for empty email", async () => {
    expect.assertions(2);
    try {
      const userBusiness = new UserBusiness(
        userDatabase as any,
        hashGenerator as any,
        tokenGenerator as any,
        idGenerator as any,
        cpfDatabase as any
      );

      await userBusiness.signUp("", "123456");
    } catch (err) {
      expect(err.errorCode).toBe(422);
      expect(err.message).toBe("Missing Input");
    }
  });

  test("Should return 'Missing Input' for empty password", async () => {
    expect.assertions(2);
    try {
      const userBusiness = new UserBusiness(
        userDatabase as any,
        hashGenerator as any,
        tokenGenerator as any,
        idGenerator as any,
        cpfDatabase as any
      );

      await userBusiness.signUp("joaodasneves@gmail.com", "",);
    } catch (err) {
      expect(err.errorCode).toBe(422);
      expect(err.message).toBe("Missing Input");
    }
  });

  test("Should return 'Invalid email' for invalid email", async () => {
    expect.assertions(2);
    try {
      const userBusiness = new UserBusiness(
        userDatabase as any,
        hashGenerator as any,
        tokenGenerator as any,
        idGenerator as any,
        cpfDatabase as any
      );

      await userBusiness.signUp(
        "joaodasnevesgmail.com",
        "123456",
      );
    } catch (err) {
      expect(err.errorCode).toBe(422);
      expect(err.message).toBe("Invalid email");
    }
  });

  test("Should return the token in success", async () => {
    
    const generateId = jest.fn(() => "id");
    idGenerator = { generate: generateId };

    const hash = jest.fn(() => "hash");
    hashGenerator = { hash };

    const generateToken = jest.fn(() => "token");
    tokenGenerator = { generate: generateToken };

    const getUserByEmail = jest.fn((email: string) => {});
    const createUser = jest.fn((user: User) => {});

    userDatabase = { getUserByEmail, createUser };

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any
    );

    const result = await userBusiness.signUp(
      "joaodasneves@gmail.com",
      "123456"
    );

    expect(result.token).toBe("token");
    expect(hash).toHaveBeenCalledWith("123456");
    expect(generateId).toHaveBeenCalledTimes(1);
    expect(generateToken).toHaveBeenCalledWith({ id: "id"});
    expect(getUserByEmail).toHaveBeenCalledWith("joaodasneves@gmail.com");
    expect(createUser).toHaveBeenCalledWith(
      new User(
        "id",
        "joaodasneves@gmail.com",
        "hash"
      )
    );
  });
});