import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';
import moment from 'moment';

export class BirthdayDataBase extends BaseDataBase {
    protected tableName: string = 'UserBirthday';

    protected toModel(dbmodel?: any): User | undefined {
        return (
            dbmodel &&
            new User(
                dbmodel.id,
                dbmodel.birthday
            )
        )
    }

    public async addBirthday(user: User): Promise<void> {

        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (birthday, id_user, updated_at)
                VALUES (
                    '${user.getBirthday()}',
                    '${user.getId()}',
                    '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                )
        `)
    }

    public async findUserByBirthday(birthday: string): Promise<User | undefined> {
        const result = await super.getConnection().raw(`
            SELECT * from ${this.tableName} WHERE birthday = '${birthday}' 
        `);

            return this.toModel(result[0][0])
    }

    public async updateBirthday(birthday: string): Promise<void> {

        await super.getConnection().raw(`
            UPDATE ${this.tableName} SET updated_at = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE birthday = '${birthday}'
        `)
    }
}