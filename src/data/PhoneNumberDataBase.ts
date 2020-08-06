import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';
import moment from 'moment';

export class PhoneNumberDataBase extends BaseDataBase {
    protected tableName: string = 'UserPhoneNumber';

    protected toModel(dbmodel?: any): User | undefined {
        return (
            dbmodel &&
            new User(
                dbmodel.id,
                dbmodel.phoneNumber
            )
        )
    }

    public async addPhoneNumber(user: User): Promise<void> {

        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (phone_number, id_user, updated_at)
                VALUES (
                    '${user.getPhoneNumber()}',
                    '${user.getId()}',
                    '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                )
        `)
    }

    public async findUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
        const result = await super.getConnection().raw(`
            SELECT * from ${this.tableName} WHERE phone_number = '${phoneNumber}' 
        `);

            return this.toModel(result[0][0])
    }

    public async updatePhoneNumber(phoneNumber: string): Promise<void> {

        await super.getConnection().raw(`
            UPDATE ${this.tableName} SET updated_at = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE phone_number = '${phoneNumber}'
        `)
    }
}