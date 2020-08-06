import { UserBusiness } from "../../src/business/UserBusiness";
import { User } from "../../src/model/User";

describe("Testing UserBusiness.addCpf", () => {
  let userDatabase = {};
  let hashGenerator = {};
  let tokenGenerator = {};
  let idGenerator = {};
  let cpfDatabase = {};
  let fullNameDatabase = {};
  let birthdayDatabase = {};
  let phoneNumberDatabase = {};
 
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

      await userBusiness.addCpf("", "123.456.789-12");
    } catch (err) {
      expect(err.errorCode).toBe(422); 
      expect(err.message).toBe("Missing Input");
    }
  }) 

  test("Should return 'Missing Input' for empty cpf", async () => {
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

      await userBusiness.addCpf("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC", "");
    } catch (err) {
        expect(err.errorCode).toBe(422);
        expect(err.message).toBe("Missing Input");
    }
  }) 

  test("Should add cpf", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByCpf = jest.fn((cpf: string) => {});
    const addCpf = jest.fn((user: User) => {});

    cpfDatabase = { findUserByCpf, addCpf};

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

    const result = await userBusiness.addCpf(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC",
      "123.456.789-12"
    );

    const user = new User("id");
    user.setCpf("123.456.789-12");

    expect(tokenVerify).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC");
    expect(findUserByCpf).toHaveBeenCalledWith("123.456.789-12");
    expect(addCpf).toHaveBeenCalledWith(
      user
    );
  });

  test("Should update field updated_at", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByCpf = jest.fn((cpf: string) => new User("id"));
    const updateCpf = jest.fn((cpf: string) => {});

    cpfDatabase = { findUserByCpf, updateCpf };

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

    const cpf = "123.456.789-12"
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC"

    const result = await userBusiness.addCpf(
      token,
      cpf
    );

    expect(tokenVerify).toHaveBeenCalledWith(token);
    expect(findUserByCpf).toHaveBeenCalledWith(cpf);
    expect(updateCpf).toHaveBeenCalledWith(cpf);
  });
})
