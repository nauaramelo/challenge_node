import { UserBusiness } from "../../src/business/UserBusiness";
import { User } from "../../src/model/User";


describe("Testing UserBusiness.addFullName", () => {
  let userDatabase = {};
  let hashGenerator = {};
  let tokenGenerator = {};
  let idGenerator = {};
  let cpfDatabase = {};
  let fullNameDatabase = {};
  let birthdayDatabase = {};
  let phoneNumberDatabase = {}
 
  test("Should return 'Missing input' for empty token", async () => {
    expect.assertions(2); 
    try {
      const userBusiness = new UserBusiness(
        userDatabase as any,
        hashGenerator as any,
        tokenGenerator as any,
        idGenerator as any,
        cpfDatabase as any,
        fullNameDatabase as any,
        birthdayDatabase as any,
        phoneNumberDatabase as any
      );

      await userBusiness.addFullName("", "João das Neves");
    } catch (err) {
      expect(err.errorCode).toBe(422); 
      expect(err.message).toBe("Missing Input");
    }
  }) 

  test("Should return 'Missing Input' for empty fullName", async () => {
    expect.assertions(2); 
    try {
      const userBusiness = new UserBusiness(
        userDatabase as any,
        hashGenerator as any,
        tokenGenerator as any,
        idGenerator as any,
        cpfDatabase as any,
        fullNameDatabase as any,
        birthdayDatabase as any,
        phoneNumberDatabase as any
      );

      await userBusiness.addFullName("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC", "");
    } catch (err) {
        expect(err.errorCode).toBe(422);
        expect(err.message).toBe("Missing Input");
    }
  }) 

  test("Should add fullName", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByFullName = jest.fn((fullName: string) => {});
    const addFullName = jest.fn((user: User) => {});

    fullNameDatabase = { findUserByFullName, addFullName};

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any,
      fullNameDatabase as any,
      birthdayDatabase as any,
      phoneNumberDatabase as any
    );

    const result = await userBusiness.addFullName(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC",
      "João das Neves"
    );

    const user = new User("id");
    user.setFullName("João das Neves");

    expect(tokenVerify).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC");
    expect(findUserByFullName).toHaveBeenCalledWith("João das Neves");
    expect(addFullName).toHaveBeenCalledWith(
      user
    );
  });

  test("Should update field updated_at", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByFullName = jest.fn((fullName: string) => new User("id"));
    const updateFullName = jest.fn((fullName: string) => {});

    fullNameDatabase = { findUserByFullName, updateFullName };

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any,
      fullNameDatabase as any,
      birthdayDatabase as any,
      phoneNumberDatabase as any
    );

    const fullName = "João das Neves"
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC"

    const result = await userBusiness.addFullName(
      token,
      fullName
    );

    expect(tokenVerify).toHaveBeenCalledWith(token);
    expect(findUserByFullName).toHaveBeenCalledWith(fullName);
    expect(updateFullName).toHaveBeenCalledWith(fullName);
  }); 
})
