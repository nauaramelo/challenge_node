import { UserDataBase } from '../data/UserDataBase';
import { CpfDataBase } from '../data/CpfDataBase';
import { FullNameDataBase } from '../data/FullNameDataBase';
import { HashGenerator } from '../services/hashGenerator';
import { TokenGenerator } from '../services/tokenGenerator';
import { IdGenerator } from '../services/idGenerator';
import { InvalidParameterError } from '../errors/InvalidParameterError';
import { ConflitError } from '../errors/ConflitError';
import { User } from '../model/User';
import { BirthdayDataBase } from '../data/BirthdayDataBase';
import { PhoneNumberDataBase } from '../data/PhoneNumberDataBase';
import { AddressDataBase } from '../data/AdressDataBase';
import { AddressInterface } from '../interfaces/AddressInterface';
import axios from 'axios';
import { NotFoundError } from '../errors/NotFoundError';
import { GenericError } from '../errors/GenericError';
import { validate } from 'gerador-validador-cpf'
import { AmountRequestedDataBase } from '../data/AmountRequested';
import { EndPointDataBase } from '../data/EndPointDataBase';
import { EndPointOrderDataBase } from '../data/EndPointOrderDatabase';

export class UserBusiness {

    private endPoints: string[] = [
        'cpf',
        'full-name',
        'birthday',
        'phone-number',
        'address',
        'amount-requested'
    ]

    constructor(
        private userDataBase: UserDataBase,
        private hashGenerator: HashGenerator,
        private tokenGenerator: TokenGenerator,
        private idGenerator: IdGenerator,
        private cpfDataBase: CpfDataBase,
        private fullNameDataBase: FullNameDataBase,
        private birthdayDatabase: BirthdayDataBase,
        private phoneNumbeDatabase: PhoneNumberDataBase,
        private addressDatabase: AddressDataBase,
        private amountRequestedDatabase: AmountRequestedDataBase,
        private endPointDatabase: EndPointDataBase,
        private endpointOrderDatabase: EndPointOrderDataBase
    ){}

    private getIndexEndPoint(endpoint: string | undefined, endpoints: string[]) {
        return endpoints.findIndex((element) => element === endpoint)
    }

    private getNextEndPoint(endpoint: string, endpoints: string[]) {
        return endpoints[this.getIndexEndPoint(endpoint, endpoints) + 1] || endpoint
    }

    private async validateOrderEndpoint(actualEndpoint: string, idUser: string, endpoints: string[]) {
        const user = await this.endPointDatabase.findUserById(idUser)

        const indexActualEndpoint = this.getIndexEndPoint(actualEndpoint, endpoints)
        const indexLastEndpointAccessed = this.getIndexEndPoint(user?.getLastEndPointAccessed(), endpoints)

        if (indexActualEndpoint - indexLastEndpointAccessed === 1 || indexActualEndpoint - indexLastEndpointAccessed === 0) {
            await this.endPointDatabase.updateEndPoint(actualEndpoint, idUser)
        }

        if (indexActualEndpoint - indexLastEndpointAccessed > 1) {
            throw new GenericError("Endpoint out of order")
        }

    }

    public async signUp(email: string, password: string) {
        
        if(!email || !password) {
            throw new InvalidParameterError("Missing Input")
        }

        if (email.indexOf("@") === -1) {
            throw new InvalidParameterError("Invalid email");
        }

        const checkUserExists = await this.userDataBase.getUserByEmail(email)

        if (checkUserExists) {
            throw new ConflitError("User already registered")
        } 

        const id = this.idGenerator.generate();
        const cryptedPassword = await this.hashGenerator.hash(password);

        await this.userDataBase.createUser(
            new User(id, email, cryptedPassword)
        )

        this.endPoints.forEach(async (endpoint, index) => {
            await this.endpointOrderDatabase.addEndPointOrder(endpoint, id, index);
        })

        const token = this.tokenGenerator.generate({ id })

        return { token }
    }

    public async addCpf(token: string, cpf: string) {
        
        if (!token || !cpf) {
            throw new InvalidParameterError("Missing Input");
        }

        if (!validate(cpf)) {
            throw new GenericError("Invalid CPF")
        }
        
        const idUserLogged = this.tokenGenerator.verify(token);

        const hasLastEndpointAccessed = this.endPointDatabase.findUserById(idUserLogged)

        if (!hasLastEndpointAccessed) {
            await this.endPointDatabase.addEndPoint('cpf', idUserLogged)
        }

        if (hasLastEndpointAccessed) {
            await this.endPointDatabase.updateEndPoint('cpf', idUserLogged)
        }

        const verifyCpfExists = await this.cpfDataBase.findUserByCpf(cpf);

        if (verifyCpfExists) {
            await this.cpfDataBase.updateCpf(cpf);
        } 

        if (!verifyCpfExists) {
            const user = new User(idUserLogged)
    
            user.setCpf(cpf)
    
            await this.cpfDataBase.addCpf(user);
        }
    }

    public async addFullName(token: string, fullName: string) {

        if (!token || !fullName){
            throw new InvalidParameterError("Missing Input")
        }

        const idUserLogged = this.tokenGenerator.verify(token);
        const verifyFullNameExists = await this.fullNameDataBase.findUserByFullName(fullName)
        const endpoints = await this.endpointOrderDatabase.findEndpointsByIdUser(idUserLogged) as string[]
        const actualEndpoint = 'full-name'; 

        await this.validateOrderEndpoint(actualEndpoint, idUserLogged, endpoints)

        if (verifyFullNameExists) {
            await this.fullNameDataBase.updateFullName(fullName)
        }

        if (!verifyFullNameExists) {
            const user = new User(idUserLogged)

            user.setFullName(fullName)

            await this.fullNameDataBase.addFullName(user)
        }

        return this.getNextEndPoint(actualEndpoint, endpoints)
    }

    public async addBirthday(token: string, birthday: string) {

        if (!token || !birthday) {
            throw new InvalidParameterError("Missing Input")
        }

        const idUserLogged = this.tokenGenerator.verify(token);
        const verifyBirthdayExists = await this.birthdayDatabase.findUserByBirthday(birthday)
        const actualEndpoint = 'birthday';
        const endpoints = await this.endpointOrderDatabase.findEndpointsByIdUser(idUserLogged) as string[]

        await this.validateOrderEndpoint(actualEndpoint, idUserLogged, endpoints)

        if (verifyBirthdayExists) {
            await this.birthdayDatabase.updateBirthday(birthday)
        }

        if (!verifyBirthdayExists) {
            const user = new User(idUserLogged)

            user.setBirthday(birthday)

            await this.birthdayDatabase.addBirthday(user)
        }

        return this.getNextEndPoint(actualEndpoint, endpoints)
    }

    public async addPhoneNumber(token: string, phoneNumber: string) {

        if (!token || !phoneNumber) {
            throw new InvalidParameterError("Missing Input")
        }

        const idUserLogged = this.tokenGenerator.verify(token);
        const verifyPhoneNumberExists = await this.phoneNumbeDatabase.findUserByPhoneNumber(phoneNumber)
        const endpoints = await this.endpointOrderDatabase.findEndpointsByIdUser(idUserLogged) as string[]
        const actualEndpoint = 'phone-number';

        await this.validateOrderEndpoint(actualEndpoint, idUserLogged, endpoints)

        if (verifyPhoneNumberExists) {
            await this.phoneNumbeDatabase.updatePhoneNumber(phoneNumber)
        }

        if (!verifyPhoneNumberExists) {
            const user = new User(idUserLogged)

            user.setPhoneNumber(phoneNumber)

            await this.phoneNumbeDatabase.addPhoneNumber(user)
        }

        return this.getNextEndPoint(actualEndpoint, endpoints)
    }

    public async addAddress(token: string, address: AddressInterface) {

        if (!token || !address.cep || !address.street || !address.number || !address.complement || !address.city || !address.state) {
            throw new InvalidParameterError("Missing Input")
        }

        if (address.cep.length > 8) {
            throw new GenericError("Invalid CEP")
        }

        if (address.state.length > 2) {
            throw new GenericError("Invalid format, the state must have two characters")
        }

        const responseWsCep = await axios.get(`http://viacep.com.br/ws/${address.cep}/json/`)

        if (responseWsCep.data.erro) {
            throw new NotFoundError("CEP not exist")
        }

        if (responseWsCep.data.logradouro != address.street) {
            throw new GenericError("Invalid Street")
        }

        if (responseWsCep.data.localidade != address.city) {
            throw new NotFoundError("City not found")
        }

        if (responseWsCep.data.uf != address.state){
            throw new NotFoundError("State not found")
        }

        const idUserLogged = this.tokenGenerator.verify(token);
        const hasUserRegistred = await this.addressDatabase.findUserByAddress(address)
        const endpoints = await this.endpointOrderDatabase.findEndpointsByIdUser(idUserLogged) as string[]
        const actualEndpoint = 'address';

        await this.validateOrderEndpoint(actualEndpoint, idUserLogged, endpoints)

        if (hasUserRegistred) {
            await this.addressDatabase.updateAddress(address)
        }

        if (!hasUserRegistred) {
            await this.addressDatabase.addAddress(idUserLogged, address)
        }
        
        return this.getNextEndPoint(actualEndpoint, endpoints)
    }

    public async addAmountRequest(token: string, amountRequested: number) {
        if (!token || !amountRequested) {
            throw new InvalidParameterError("Missing Input");
        }

        const idUserLogged = this.tokenGenerator.verify(token);
        const hasUserRegistred = await this.amountRequestedDatabase.findUserByAmountRequested(amountRequested, idUserLogged);
        const endpoints = await this.endpointOrderDatabase.findEndpointsByIdUser(idUserLogged) as string[]

        const actualEndpoint = 'amount-requested';

        await this.validateOrderEndpoint(actualEndpoint, idUserLogged, endpoints)

        if (hasUserRegistred){
            await this.amountRequestedDatabase.updateAmountRequested(amountRequested, idUserLogged)
        }

        if (!hasUserRegistred){
            const user = new User(idUserLogged)

            user.setAmountRequested(amountRequested)

            await this.amountRequestedDatabase.addAmountRequested(user)
        }

        const nextEndpoint = this.getNextEndPoint(actualEndpoint, endpoints)

        return nextEndpoint === actualEndpoint ? actualEndpoint : nextEndpoint
    }
}