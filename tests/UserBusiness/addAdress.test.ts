import { UserBusiness } from "../../src/business/UserBusiness";
import { User } from "../../src/model/User";
import { AddressInterface } from "../../src/interfaces/AddressInterface";


describe("Testing UserBusiness.addAddress", () => {
  let userDatabase = {};
  let hashGenerator = {};
  let tokenGenerator = {};
  let idGenerator = {};
  let cpfDatabase = {};
  let fullNameDatabase = {};
  let birthdayDatabase = {};
  let phoneNumberDatabase = {};
  let addressDatabase = {}
 
  test("Should add Address", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByAddress = jest.fn((address: AddressInterface) => {});
    const addAddress = jest.fn((address: AddressInterface) => {});

    addressDatabase = { findUserByAddress, addAddress};

    const userBusiness = new UserBusiness(
      userDatabase as any,
      hashGenerator as any,
      tokenGenerator as any,
      idGenerator as any,
      cpfDatabase as any,
      fullNameDatabase as any,
      birthdayDatabase as any,
      phoneNumberDatabase as any,
      addressDatabase as any
    );  

    const address = {
        number: 1,
        state: "Rio de Janeiro",
        city: "Rio de Janeiro",
        street: "Rua Amarela",
        cep: 123546454,
        complement: "Pé de jambo no quintal"
    } as AddressInterface

    const result = await userBusiness.addAddress(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC",
        address
    );
  
      expect(tokenVerify).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZC");
      expect(findUserByAddress).toHaveBeenCalledWith(address);
      expect(addAddress).toHaveBeenCalledWith("id", address);  
    });
}) 