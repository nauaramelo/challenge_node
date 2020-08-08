import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';
import moment from 'moment';

export class AmountRequestedDataBase extends BaseDataBase {
    protected tableName: string = 'UserAmountRequested';

    protected toModel(dbmodel?: any): User | undefined {
        return (
            dbmodel &&
            new User(
                dbmodel.id,
                dbmodel.amountRequest
            )
        )
    }

    public async addAmountRequested(user: User): Promise<void> {
        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (amount_requested, id_user, updated_at)
                VALUES (
                    '${user.getAmountRequested()}', 
                    '${user.getId()}',
                    '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                )
        `)

    }
    
    public async findUserByAmountRequested(amountRequested: number, idUser: string): Promise<User | undefined> {
        const result = await super.getConnection().raw(`
            SELECT * from ${this.tableName} WHERE amount_requested = ${amountRequested} and id_user = '${idUser}'
        `);

            return this.toModel(result[0][0])
    }

    public async updateAmountRequested(amountRequested: number, idUser: string): Promise<void> {
        await super.getConnection().raw(`
            UPDATE ${this.tableName} SET updated_at = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE amount_requested = ${amountRequested} and id_user = '${idUser}'
        `)
    }
}