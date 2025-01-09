import { ResponseType } from "@type/index";
import { Response } from "express";
import { HttpStatusCode } from "./httpStatusCodes";
import { LoggerService } from "@services/logger.service";
import clearUploadFolder from "@middleware/cleanUpResources";
export class ResponseHandler<T> {
  private res: Response;
  private logger: LoggerService;
  constructor(res: Response, service?: string) {
    this.res = res;
    this.logger = new LoggerService(service ?? "");
  }
  public send(
    status: HttpStatusCode,
    message: string = "",
    data: T | T[] | null = null
  ) {
    const clientResponse: ResponseType<T | T[]> = { data };
    clientResponse.errorMessage =status.code===200 ? '': status.message;
    if (message) {
      clientResponse.message = message;
    }
    clearUploadFolder();
    return this.res.status(status.code).json(clientResponse);
  }

  handleError = (
    error: any,
    status:HttpStatusCode | null,
    message: string
  ) => {
    const errorMessage = error.message || error ||  (status && status.message);
    const errorCode = error.code ?? (status && status.code)
    this.logger.error(errorMessage)
    clearUploadFolder();
    this.send({ code:errorCode, message: errorMessage }, message);
  };
}
