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