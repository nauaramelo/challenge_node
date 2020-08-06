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

export class UserBusiness {
    constructor(
        private userDataBase: UserDataBase,
        private hashGenerator: HashGenerator,
        private tokenGenerator: TokenGenerator,
        private idGenerator: IdGenerator,
        private cpfDataBase: CpfDataBase,
        private fullNameDataBase: FullNameDataBase,
        private birthdayDatabase: BirthdayDataBase
    ){}

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

        const token = this.tokenGenerator.generate({id})

        return {token}
    }

    public async addCpf(token: string, cpf: string) {
        
        if (!token || !cpf) {
            throw new InvalidParameterError("Missing Input");
        }
        
        const idUserLogged = this.tokenGenerator.verify(token);
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

        if (verifyFullNameExists) {
            await this.fullNameDataBase.updateFullName(fullName)
        }

        if (!verifyFullNameExists) {
            const user = new User(idUserLogged)

            user.setFullName(fullName)

            await this.fullNameDataBase.addFullName(user)
        }
    }

    public async addBirthday(token: string, birthday: string) {

        if (!token || !birthday) {
            throw new InvalidParameterError("Missing Input")
        }

        const idUserLogged = this.tokenGenerator.verify(token);
        const verifyBirthdayExists = await this.birthdayDatabase.findUserByBirthday(birthday)

        if (verifyBirthdayExists) {
            await this.birthdayDatabase.updateBirthday(birthday)
        }

        if (!verifyBirthdayExists) {
            const user = new User(idUserLogged)

            user.setBirthday(birthday)

            await this.birthdayDatabase.addBirthday(user)
        }
    }
}