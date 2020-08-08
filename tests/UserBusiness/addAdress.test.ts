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
  let addressDatabase = {};
  let amountRequestedDatabase = {}
  let endPointDataBase = {}; 
  let endpointOrderDatabase = {}
 
  test("Should add Address", async () => {

    const tokenVerify = jest.fn((token: string) => "id")
    tokenGenerator = { verify: tokenVerify };

    const findUserByAddress = jest.fn((address: AddressInterface) => {});
    const addAddress = jest.fn((address: AddressInterface) => {});

    addressDatabase = { findUserByAddress, addAddress};

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

    const address = {
        number: 1,
        state: "PB",
        city: "João Pessoa",
        street: "Rua Lucinéia Cabral Batista",
        cep: "58030120",
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