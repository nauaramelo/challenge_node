import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { TokenGenerator } from "../services/tokenGenerator";
import { UserDataBase } from "../data/UserDataBase";
import { HashGenerator } from "../services/hashGenerator";
import { IdGenerator } from "../services/idGenerator";
import { CpfDataBase } from "../data/CpfDataBase";
import { FullNameDataBase } from "../data/FullNameDataBase";
import { BirthdayDataBase } from "../data/BirthdayDataBase";
import { PhoneNumberDataBase } from "../data/PhoneNumberDataBase";
import { AddressDataBase } from "../data/AdressDataBase";
import { AmountRequestedDataBase } from "../data/AmountRequested";
import { EndPointDataBase } from "../data/EndPointDataBase";
import { EndPointOrderDataBase } from "../data/EndPointOrderDatabase";

export class UserController {
  private static UserBusiness = new UserBusiness(
    new UserDataBase(),
    new HashGenerator(),
    new TokenGenerator(),
    new IdGenerator(),
    new CpfDataBase(),
    new FullNameDataBase(),
    new BirthdayDataBase(),
    new PhoneNumberDataBase(),
    new AddressDataBase(),
    new AmountRequestedDataBase(),
    new EndPointDataBase(),
    new EndPointOrderDataBase()
  );

  public async signUp(req: Request, res: Response) {
    try {
        
      const result = await UserController.UserBusiness.signUp(
        req.body.email,
        req.body.password
      );

      
      res.status(200).send(result)

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

  public async addCpf(req: Request, res: Response) {
    try {
      
      const result = await UserController.UserBusiness.addCpf(
        req.body.token,
        req.body.cpf 
      );
  
      res.status(200).send({ message: "Sucess"})

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

  public async addFullName(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.addFullName(
        req.body.token,
        req.body.fullName
      )

      res.status(200).send({ success: true, 'next-end-point': result});
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

  public async addBirthday(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.addBirthday(
        req.body.token,
        req.body.birthday
      )

      res.status(200).send({ success: true, 'next-end-point': result});
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

  public async addPhoneNumber(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.addPhoneNumber(
        req.body.token,
        req.body.phoneNumber
      )

      res.status(200).send({ success: true, 'next-end-point': result});
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

  public async addAddress(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.addAddress(
        req.body.token,
        req.body.address
      )

      res.status(200).send({ success: true, 'next-end-point': result});
    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

  public async addAmountRequested(req: Request, res: Response) {
    try {
      const result = await UserController.UserBusiness.addAmountRequest(
        req.body.token,
        req.body.amountRequested
      )

      res.status(200).send({ success: true, 'next-end-point': result});

    } catch (err) {
      res.status(err.errorCode || 400).send({ message: err.message})
    }
  }

}