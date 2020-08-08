import { UserBusiness } from "../../src/business/UserBusiness";
import { User } from "../../src/model/User";


describe("Testing UserBusiness.addPhoneNumber", () => {
  let userDatabase = {};
  let hashGenerator = {};
  let tokenGenerator = {};
  let idGenerator = {};
  let cpfDatabase = {};
  let fullNameDatabase = {};
  let birthdayDatabase = {};
  let phoneNumberDatabase = {};
  let addressDatabase = {};
  let amountRequestedDatabase = {}
  let endPointDataBase = {}; 
  let endpointOrderDatabase = {}
 
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
        phoneNumberDatabase as any,
        addressDatabase as any,
        amountRequestedDatabase as any,
        endPointDataBase as any,
        endpointOrderDatabase as any
      );

      await userBusiness.addPhoneNumber("", "(11) 999998888");
    } catch (err) {
      expect(err.errorCode).toBe(422); 
      expect(err.message).toBe("Missing Input");
    }
  }) 

   test("Should return 'Missing Input' for empty phone number", async () => {
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
        phoneNumberDatabase as any,
        addressDatabase as any,
        amountRequestedDatabase as any,
        endPointDataBase as any,
        endpointOrderDatabase as any
      );

      await userBusiness.addPhoneNumber("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC", "");
      
    } catch (err) {
        expect(err.errorCode).toBe(422);
        expect(err.message).toBe("Missing Input");
    }
  })  

  test("Should add Phone Number", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByPhoneNumber = jest.fn((phoneNumber: string) => {});
    const addPhoneNumber = jest.fn((user: User) => {});

    phoneNumberDatabase = { findUserByPhoneNumber, addPhoneNumber};

    const findEndpointsByIdUser = jest.fn((idUserLogged: string) => [])
    endpointOrderDatabase = { findEndpointsByIdUser }

    const validateOrderEndpoint = jest.fn((actualEndpoint: string, idUserLogged: string, endpoints: string[]) => Promise.resolve())

    const findUserById = jest.fn((idUser: string) => {
      const user = new User("id")
      user.setLastEndPointAccessed("full-name")
    })

    const updateEndPoint = jest.fn((actualEndpoint: string, idUser: string) => {})

    endPointDataBase = { findUserById, updateEndPoint}

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any,
      fullNameDatabase as any,
      birthdayDatabase as any,
      phoneNumberDatabase as any,
      addressDatabase as any,
      amountRequestedDatabase as any,
      endPointDataBase as any,
      endpointOrderDatabase as any
    );

    const result = await userBusiness.addPhoneNumber(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC",
      "(11) 999998888"
    );

    const user = new User("id");
    user.setPhoneNumber("(11) 999998888");

    expect(tokenVerify).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC");
    expect(findUserByPhoneNumber).toHaveBeenCalledWith("(11) 999998888");
    expect(addPhoneNumber).toHaveBeenCalledWith(
      user
    );
  });

  test("Should update field updated_at", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByPhoneNumber = jest.fn((phoneNumber: string) => new User("id"));
    const updatePhoneNumber = jest.fn((phoneNumber: string) => {});

    phoneNumberDatabase = { findUserByPhoneNumber, updatePhoneNumber };

    const findEndpointsByIdUser = jest.fn((idUserLogged: string) => [])
    endpointOrderDatabase = { findEndpointsByIdUser }

    const validateOrderEndpoint = jest.fn((actualEndpoint: string, idUserLogged: string, endpoints: string[]) => Promise.resolve())

    const findUserById = jest.fn((idUser: string) => {
      const user = new User("id")
      user.setLastEndPointAccessed("full-name")
    })

    const updateEndPoint = jest.fn((actualEndpoint: string, idUser: string) => {})

    endPointDataBase = { findUserById, updateEndPoint}

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any,
      fullNameDatabase as any,
      birthdayDatabase as any,
      phoneNumberDatabase as any,
      addressDatabase as any,
      amountRequestedDatabase as any,
      endPointDataBase as any,
      endpointOrderDatabase as any
    );

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC"
    const phoneNumber = "(11) 999998888"

    const result = await userBusiness.addPhoneNumber(
      token,
      phoneNumber
    );

    expect(tokenVerify).toHaveBeenCalledWith(token);
    expect(findUserByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
    expect(updatePhoneNumber).toHaveBeenCalledWith(phoneNumber);
  });   
})