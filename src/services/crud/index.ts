import { LoggerService } from "@services/logger.service";
import { ResponseType } from "@type/index";


/**
 * DbCRUD Class
 * A reusable generic database CRUD class for handling common operations on a Mongoose model.
 * Provides methods for adding, finding, updating, and removing documents from the database.
 *
 * @template T - The type representing the schema of the database document.
 * @template AddModel - The type of the data used for creating a new document (default: T).
 */

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
   *
   * @param data - The data for creating a new document.
   * @param query - The query to check for the existence of the document.
   * @param strict - If true, returns an error message when the document already exists.
   * @returns A response containing the added document or the existing document.
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

  /**
   * Finds all documents matching the given criteria.
   *
   * @param option - Options for populating related fields.
   * @returns A response containing the list of documents or an empty array if none are found.
   */
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

  /**
   * Finds a single document matching the given query.
   *
   * @param query - The query for finding the document.
   * @param option - Options for populating related fields.
   * @returns A response containing the document or null if not found.
   */
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


  /**
   * Finds multiple documents matching the given query.
   *
   * @param query - The query for finding the documents.
   * @returns A response containing the list of documents or null if an error occurs.
   */
  find = async (query: Partial<T>): Promise<ResponseType<T[]> | null> => {
    try {
      return { data: await this.model.find(query) };
    } catch (error) {
      return null;
    }
  };

  /**
   * Updates a single document based on the query and update data.
   *
   * @param query - The query for finding the document to update.
   * @param update - The data to update the document with.
   * @returns A response containing the updated document or an error message.
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
   * Removes a single document based on the given query.
   *
   * @param query - The query for finding the document to remove.
   * @returns A response containing the removed document or an error message.
   */
  removeDocument = async (
    query: Partial<T>
  ): Promise<ResponseType<T | null>> => {
    try {
      const result = await this.model.findOneAndDelete(query);
      return { data: result };
    } catch (error) {
      this.logger.error("Error removing document", { error });
      return { errorMessage: "Failed to remove document", data: null };
    }
  };
}
