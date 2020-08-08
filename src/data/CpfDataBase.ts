import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';
import moment from 'moment';

export class CpfDataBase extends BaseDataBase {
    protected tableName: string = 'UserCPF';

    protected toModel(dbmodel?: any): User | undefined {
        return (
            dbmodel &&
            new User(
                dbmodel.id,
                dbmodel.cpf
            )
        )
    }

    public async addCpf(user: User): Promise<void> {
        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (cpf, id_user, updated_at)
                VALUES (
                    '${user.getCpf()}', 
                    '${user.getId()}',
                    '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                )
        `)

    }
    
    public async findUserByCpf(cpf: string): Promise<User | undefined> {
        const result = await super.getConnection().raw(`
            SELECT * from ${this.tableName} WHERE CPF = '${cpf}'
        `);

            return this.toModel(result[0][0])
    }

    public async updateCpf(cpf: string): Promise<void> {
        await super.getConnection().raw(`
            UPDATE ${this.tableName} SET updated_at = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE CPF = '${cpf}'
        `)
    }
}
