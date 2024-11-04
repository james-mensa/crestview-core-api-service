import { ResponseType } from "@type/index";
import { Logger, createLogger, transports, format } from "winston";

export class DbCRUD<T, AddModel = T> {
  private model: any;
  private logger: Logger;

  /**
   * Initializes the DbCRUD instance.
   * @param service - The service name using this CRUD class.
   * @param model - The Mongoose model to interact with the database.
   */
  constructor(service: string, model: any) {
    this.model = model;
    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.Console()],
    }).child({ service, context: "MongoDB" });
  }

  /**
   * Adds a new document to the database if it does not already exist.
   * @param data - The data to add to the database.
   * @param query - The query to check if the document already exists.
   * @returns The added document or null if it already exists.
   */
  async add(data: AddModel, query: Partial<T>): Promise<T | null> {
    try {
      const existingDocument = await this.model.findOne(query);
      if (existingDocument) {
        this.logger.info("Document already exists", { query });
        return null;
      }
      const newDocument = await this.model.create(data);
      this.logger.info("Document added successfully", { newDocument });
      return newDocument;
    } catch (error) {
      this.logger.error("Error adding document", { error });
      throw new Error("Failed to add document");
    }
  }

  async findAll(): Promise<ResponseType<T[]> | null> {
    try {
      return {data: await this.model.find({})};
    } catch (error) {
      return null;
    }
  }

  async findOne(query:Partial<T>): Promise<ResponseType<T[]> | null> {
    try {
      return {data: await this.model.findOne(query)};
    } catch (error) {
      return null;
    }
  }


  async find(query:Partial<T>): Promise<ResponseType<T[]> | null> {
    try {
      return {data: await this.model.find(query)};
    } catch (error) {
      return null;
    }
  }
  
//   async updateOne(query: Partial<T>, update: Partial<T>): Promise<ResponseType<T[]> | null> {}

// async removeDocument(query: Partial<T>): Promise<ResponseType<T[]{}


}
