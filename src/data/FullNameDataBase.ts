import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';
import moment from 'moment';

export class FullNameDataBase extends BaseDataBase {
    protected tableName: string = 'UserFullName';

    protected toModel(dbmodel?: any): User | undefined {
        return (
            dbmodel &&
            new User(
                dbmodel.id,
                dbmodel.fullName
            )
        )
    }

    public async addFullName(user: User): Promise<void> {
        const names = user.getFullName()?.split(" ")
        const firstName = names?.slice(0, 1).join(' ');
        const lastName = names?.slice(1).join(' ');

        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (first_name, last_name, id_user, updated_at)
                VALUES (
                    '${firstName}',
                    '${lastName}', 
                    '${user.getId()}',
                    '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                )
        `)
    }

    public async findUserByFullName(fullName: string): Promise<User | undefined> {
        const names = fullName.split(" ")
        const firstName = names.slice(0, 1).join(' ');
        const lastName = names.slice(1).join(' ');

        const result = await super.getConnection().raw(`
            SELECT * from ${this.tableName} WHERE first_name = '${firstName}' AND last_name = '${lastName}'
        `);

            return this.toModel(result[0][0])
    }

    public async updateFullName(fullName: string): Promise<void> {
        const names = fullName.split(" ")
        const firstName = names.slice(0, 1).join(' ');
        const lastName = names.slice(1).join(' ');

        await super.getConnection().raw(`
            UPDATE ${this.tableName} SET updated_at = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE first_name = '${firstName}' AND last_name = '${lastName}'
        `)
    }
}