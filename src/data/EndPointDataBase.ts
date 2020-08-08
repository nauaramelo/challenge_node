import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';

export class EndPointDataBase extends BaseDataBase {
    protected tableName: string = 'UserEndpoint';

    protected toModel(dbmodel?: any): User | undefined {
        const user = dbmodel ? new User(dbmodel.id_user) : undefined
        user?.setLastEndPointAccessed(dbmodel.endpoint);
        
        return user;
    }

    public async addEndPoint(actualEndpoint: string, idUser: string): Promise<void> {
        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (endpoint, id_user)
                VALUES (
                    '${actualEndpoint}', 
                    '${idUser}'
                )
        `)
    }
    
    public async findUserById(id: string): Promise<User | undefined> {
        const result = await super.getConnection().raw(`
            SELECT * from ${this.tableName} WHERE id_user = '${id}'
        `);

            return this.toModel(result[0][0])
    }

    public async updateEndPoint(actualEndpoint: string, idUser: string): Promise<void> {
        await super.getConnection().raw(`
            UPDATE ${this.tableName} SET endpoint = '${actualEndpoint}' WHERE id_user = '${idUser}'
        `)
    }
}