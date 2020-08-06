import { UserBusiness } from "../../src/business/UserBusiness";
import { User } from "../../src/model/User";


describe("Testing UserBusiness.addBirthday", () => {
  let userDatabase = {};
  let hashGenerator = {};
  let tokenGenerator = {};
  let idGenerator = {};
  let cpfDatabase = {};
  let fullNameDatabase = {};
  let birthdayDatabase = {};
 
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
        birthdayDatabase as any
      );

      await userBusiness.addBirthday("", "01/10/1991");
    } catch (err) {
      expect(err.errorCode).toBe(422); 
      expect(err.message).toBe("Missing Input");
    }
  }) 

  test("Should return 'Missing Input' for empty birthday", async () => {
    expect.assertions(2); 
    try {
      const userBusiness = new UserBusiness(
        userDatabase as any,
        hashGenerator as any,
        tokenGenerator as any,
        idGenerator as any,
        cpfDatabase as any,
        fullNameDatabase as any,
        birthdayDatabase as any
      );

      await userBusiness.addBirthday("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC", "");
      
    } catch (err) {
        expect(err.errorCode).toBe(422);
        expect(err.message).toBe("Missing Input");
    }
  }) 

  test("Should add Birthday", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByBirthday = jest.fn((birthday: string) => {});
    const addBirthday = jest.fn((user: User) => {});

    birthdayDatabase = { findUserByBirthday, addBirthday};

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any,
      fullNameDatabase as any,
      birthdayDatabase as any
    );

    const result = await userBusiness.addBirthday(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC",
      "01/10/1991"
    );

    const user = new User("id");
    user.setBirthday("01/10/1991");

    expect(tokenVerify).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC");
    expect(findUserByBirthday).toHaveBeenCalledWith("01/10/1991");
    expect(addBirthday).toHaveBeenCalledWith(
      user
    );
  });

  test("Should update field updated_at", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByBirthday = jest.fn((birthday: string) => new User("id"));
    const updateBirthday = jest.fn((birthday: string) => {});

    birthdayDatabase = { findUserByBirthday, updateBirthday };

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any,
      fullNameDatabase as any,
      birthdayDatabase as any
    );

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC"
    const birthday = "01/10/1991"

    const result = await userBusiness.addBirthday(
      token,
      birthday
    );

    expect(tokenVerify).toHaveBeenCalledWith(token);
    expect(findUserByBirthday).toHaveBeenCalledWith(birthday);
    expect(updateBirthday).toHaveBeenCalledWith(birthday);
  });  
})