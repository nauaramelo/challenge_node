export class User {
    constructor(
        private id: string,
        private email?: string,
        private password?: string,
        private cpf?: string,
        private fullName?: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public getEmail(): string | undefined {
        return this.email;
    }
    
    public getPassword(): string | undefined {
        return this.password;
    }

    public getCpf(): string | undefined {
        return this.cpf
    }

    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    public getFullName(): string | undefined {
        return this.fullName
    }

    public setFullName(fullName: string): void {
        this.fullName = fullName
    }
}
