import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';

export class UserDataBase extends BaseDataBase {
    protected tableName: string = 'Users';

    protected toModel(dbmodel?: any): User | undefined {
        return (
            dbmodel &&
            new User(
                dbmodel.id,
                dbmodel.email,
                dbmodel.password
            )
        )
    }

    public async createUser(user: User): Promise<void> {
        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (id, email, password)
                VALUES (
                    '${user.getId()}',
                    '${user.getEmail()}',
                    '${user.getPassword()}'
                )
        `)
    }

    public async getUserByEmail(email: string): Promise<User | undefined> {
        const result = await super.getConnection().raw(`
          SELECT * from ${this.tableName} WHERE email = '${email}'
          `);
        return this.toModel(result[0][0]);
    }
}
