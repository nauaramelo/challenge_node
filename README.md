## Provi Node.js Challenge

## Pré-requisitos

:warning: [Node](https://nodejs.org/en/download/)

:warning: [MYSQL](https://www.mysql.com/downloads/)

## Como rodar a aplicação :arrow_forward:

No terminal, clone o projeto: 

```
git clone https://github.com/nauaramelo/challenge_node.git
```
Entre no projeto e instale as dependências através do comando:
```
npm install
```
Suba a aplicação: 
```
npm start
```
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```
DB_HOST = 
DB_PORT = 
DB_USER = 
DB_PASSWORD = 
DB_DATABASE_NAME = 
JWT_KEY = 
```
Por último, crie as tabelas no MYSQL: 
```SQL
CREATE TABLE Users(
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE UserCPF(
    CPF VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY, 
    id_user VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES Users(id)
);

CREATE TABLE UserFullName(
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    id_user VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(first_name, last_name),
    FOREIGN KEY (id_user) REFERENCES Users(id)
)

CREATE TABLE UserBirthday(
    birthday VARCHAR(255) PRIMARY KEY,
    id_user VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES Users(id)
);

CREATE TABLE UserPhoneNumber(
    phone_number VARCHAR(255) PRIMARY KEY,
    id_user VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES Users(id)
);

CREATE TABLE UserAddress(
	cep VARCHAR(255),
	street VARCHAR(255),
	number INT, 
	complement VARCHAR(255),
	city VARCHAR(255),
	state VARCHAR(255),
	id_user VARCHAR(255),
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(cep, street, number, complement, city, state),
	FOREIGN KEY (id_user) REFERENCES Users(id)
);

CREATE TABLE UserAmountRequested(
    amount_requested FLOAT, 
    id_user VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(amount_requested, id_user),
    FOREIGN KEY (id_user) REFERENCES Users(id)
);

CREATE TABLE UserEndpoint(
    endpoint VARCHAR(50),
    id_user VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (id_user) REFERENCES Users(id)
);

CREATE TABLE UserOrderEndpoint(
    id_user VARCHAR(255),
    endpoint VARCHAR(50),
    position INT,
    PRIMARY KEY(id_user, endpoint),
    FOREIGN KEY (id_user) REFERENCES Users(id)
)
```

## Pontos a melhorar

- [ ]  Adicionar mais casos de testes.
- [ ]  Adicionar estratégia de cache para guardar o último endpoint acionado pelo usuário(atualmente está no banco de dados, visando o aumento da performance da API)

## Background

Provi is a fintech that offers loans for educational purposes without guarantees for individuals. Our goal is promote specialized education for brazilians to get qualified and reach their dream. We finance courses and specializations for designers, developers, data scientists, digital marketers, etc.

Obs: For reasons of privacy all of our data for this challenges are pseudonymised or fake

## Challenge

At Provi we use **Node.js** and **Express.js** as our main stack. We like to see how comfortable you are with this stack. The challenge consist in building an API that will simulate some of the challenges that we face every day. The challenge has 3 steps, each with increasing difficulty, so we don't expect to complete all parts depending on the your seniority level. Our main product is guided form where users fill in their personal information to request a loan, we will ask to build something similar 😃.

**Requirement:**

- Use Node.js
- Use Express.js
- Use Git
- Use Jest for testing
- Use npm

Besides that you are free use **ANYTHING** else.

### 1st Part

Build a way for a **User** to register, it must require email and password. Once they are register, return a token that they will use to send their data and validate their identity.

Build **5** RESTful api points where a **Users** can send each part of their personal information. They need to pass token and data in the body of the request. You need store this information some where.

- **CPF** -> String
- **Full Name** -> String
- **Birthday** -> String
- **Phone Number** -> Number
- **Address** (CEP, street, number, complement, city, state) -> String and Number

Example:

**POST api/v1/full-name**

```
{
  token: 'ncl23cm234ncwer342'
  data: João das Neves
}
```

#### Business requirements:

- All information is unique per **User**, so 2 **Users** cannot have the same information.

- If a second request is made to the same end-point with the same data, just update current timestamp. If a different data is pass, don't alter old record, just create a new record.

Example:

User sends a phone number for the first time, it will create a new record.

```
data: (11) 9222-2222, updatedAt: 2019-11-26 18:11:55
```

User makes a second request with the same data, it will only update the updatedAt with the current time.

```
data: (11) 9222-2222, updatedAt: 2019-11-26 19:12:31
```

User makes a third request with a new phone number, it will create a new record.

```
data: (11) 9222-2222, updatedAt: 2019-11-26 19:12:31
data: (11) 9111-1111, updatedAt: 2019-11-26 19:15:12
```

- **Full Name** must be split. The first part of the name will be store as **First Name**, the rest of the name will store as **Last Name**.

Example:

```
First Name -> João
Last Name -> Da Neves
```

- Add test as you see fit

### 2nd Part

- Add a verification step for **CPF**, verify it is valid **CPF** number.
- Add a verification step for the **CEP**. Use a third party API for **CEPs** and verify if the submitted address is valid. Make sure that you validate some parts of the address, as **Users** might input address with some parts of the street name missing.
- Add a new end-point -> **Amount Requested**, will received data in cents. This will be the amount of money request for a loan.
- The order of the end-points must be maintained and checked, to achieve this, create a place where you can save the order of the end-points. Such that
  CPF -> Full Name -> Birthday -> Phone Number -> Address -> Amount Requested order **must be enforce**.
  If a request is made out of order, it must return message informing an error. If the request is valid with the correct order, it must inform which is the next end-point the **User** has to request to.

Example:
POST api/v1/full-name

```
{
  token: 'ncl23cm234ncwer342'
  data: João das Neves
}
```

Response:

```
{
success: true
next-end-point: 'birth-date'
}
```

### 3rd Part

- Imagine now that we want to add N end-points, (**Personal Documents**, **Proof Of Address**, **Number of Dependents**, etc..). We don't know how many end-points will be added in the future. The user it will be assigned a unique order of end-points that will be determine at registration. If a new end-point is added after the user register, it will not affect that current users path. Same Business logic applies as before for handling errors. Come up with a solution for making sure that all users can complete their loan request path.
