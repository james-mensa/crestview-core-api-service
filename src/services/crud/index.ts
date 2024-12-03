import { LoggerService } from "@services/logger.service";
import { ResponseType } from "@type/index";

export class DbCRUD<T, AddModel = T> {
  private model: any;
  private logger: LoggerService;

  /**
   * Initializes the DbCRUD instance.
   * @param service - The service name using this CRUD class.
   * @param model - The Mongoose model to interact with the database.
   */
  constructor(service: string, model: any) {
    this.model = model;
    this.logger = new LoggerService(service);
  }

  /**
   * Adds a new document to the database if it does not already exist.
   * @param data - The data to add to the database.
   * @param query - The query to check if the document already exists.
   * @returns The added document or null if it already exists.
   */

  add = async (
    data: AddModel,
    query: Partial<T>,
    strict?: boolean
  ): Promise<ResponseType<T> | null> => {
    try {
      const existingDocument = await this.model.findOne(query);
      if (existingDocument) {
        if (strict) {
          return { errorMessage: "Document already exists", data: null };
        }
        return { data: existingDocument };
      }
      const newDocument = await this.model.create(data);
      return { data: newDocument };
    } catch (error) {
      this.logger.error("Error adding document", { error });
      return { errorMessage: "Failed to add document", data: null };
    }
  };

  findAll = async (option?: {
    populate: string | string[];
  }): Promise<ResponseType<T[]> | null> => {
    try {
      let query = this.model.find({});
      if (option?.populate) {
        query = query.populate(option.populate);
      }
      const data = await query;
      return { data };
    } catch (error) {
      return null;
    }
  };

  findOne = async (
    query: Partial<T>,
    option?: {
      populate: string | string[];
    }
  ): Promise<ResponseType<T> | null> => {
    try {
      let __query = this.model.findOne(query);
  
      if (option?.populate) {
        __query = __query.populate(option.populate);
      }
      const data = await __query;
      return { data };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  find = async (query: Partial<T>): Promise<ResponseType<T[]> | null> => {
    try {
      return { data: await this.model.find(query) };
    } catch (error) {
      return null;
    }
  };

  /**
   * Updates a document based on a query and update data.
   * @param query - The query to find the document to update.
   * @param update - The data to update the document with.
   * @returns The updated document or an error message.
   */
  updateOne = async (
    query: Partial<T>,
    update: Partial<T>
  ): Promise<ResponseType<T | null>> => {
    try {
      const updatedDocument = await this.model.findOneAndUpdate(query, update, {
        new: true,
      });
      return { data: updatedDocument };
    } catch (error) {
      this.logger.error("Error updating document", { error });
      return { errorMessage: "Failed to update document", data: null };
    }
  };

  /**
   * Removes a document based on a query.
   * @param query - The query to find the document to remove.
   * @returns A success message or an error message.
   */
  removeDocument = async (
    query: Partial<T>
  ): Promise<ResponseType<string | null>> => {
    try {
      const result = await this.model.findOneAndDelete(query);
      return { data: result };
    } catch (error) {
      this.logger.error("Error removing document", { error });
      return { errorMessage: "Failed to remove document", data: null };
    }
  };
}
