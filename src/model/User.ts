export class User {
    constructor(
        private id: string,
        private email: string,
        private password: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public getEmail(): string {
        return this.email;
    }
    
    public getPassword(): string {
        return this.password;
    }
}
