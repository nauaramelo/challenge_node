import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';

export class EndPointOrderDataBase extends BaseDataBase {
    protected tableName: string = 'UserOrderEndpoint';

    protected toModel(dbmodel?: any): User | undefined {
        const user = dbmodel ? new User(dbmodel.id_user) : undefined
        user?.setLastEndPointAccessed(dbmodel.endpoint);
        
        return user;
    }

    public async addEndPointOrder(actualEndpoint: string, idUser: string, index: number): Promise<void> {
        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (endpoint, id_user, position)
                VALUES (
                    '${actualEndpoint}', 
                    '${idUser}',
                     ${index}
                )
        `)
    }
    
    public async findEndpointsByIdUser(idUser: string): Promise<string[] | undefined> {
        const result = await super.getConnection().raw(`
            SELECT endpoint from ${this.tableName} WHERE id_user = '${idUser}' ORDER BY position
        `);

        return result[0] && result[0].map((dbModel: any) => {
            return dbModel.endpoint
        })
    }
}