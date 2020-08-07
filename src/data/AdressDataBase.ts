import { BaseDataBase } from './BaseDataBase';
import { User } from '../model/User';
import moment from 'moment';
import { Address } from '../model/Address';
import { AddressInterface } from '../interfaces/AddressInterface';

export class AddressDataBase extends BaseDataBase {
    protected tableName: string = 'UserAddress';

    protected toModel(dbmodel?: any): User | undefined {
        return (
            dbmodel &&
            new User(
                dbmodel.id,
                dbmodel.adress
            )
        )
    }

    public async addAddress(id_user: string, address: AddressInterface): Promise<void> {

        await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (cep, street, number, complement, city, state, id_user, updated_at)
                VALUES (
                    '${address.cep}',
                    '${address.street}',
                    '${address.number}',
                    '${address.complement}',
                    '${address.city}',
                    '${address.state}',
                    '${id_user}',
                    '${moment().format('YYYY-MM-DD HH:mm:ss')}'
                )
        `)
    }

    public async findUserByAddress(address: AddressInterface): Promise<User | undefined> {
        const result = await super.getConnection().raw(`
            SELECT * from ${this.tableName} WHERE 
            cep = '${address.cep}' AND
            street = '${address.street}' AND
            number = '${address.number}' AND
            complement = '${address.complement}' AND
            city = '${address.city}' AND
            state = '${address.state}'
        `);

            return this.toModel(result[0][0])
    }

    public async updateAddress(address: AddressInterface): Promise<void> {

        await super.getConnection().raw(`
            UPDATE ${this.tableName} SET updated_at = '${moment().format('YYYY-MM-DD HH:mm:ss')}' WHERE 
            cep = '${address.cep}' AND
            street = '${address.street}' AND
            number = '${address.number}' AND
            complement = '${address.complement}' AND
            city = '${address.city}' AND
            state = '${address.state}'
        `)
    }
}