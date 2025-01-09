import  {Options} from "swagger-jsdoc";
import { appConfig } from "./appConfig";
import path from "path";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: appConfig.api_version??'1.0.0',
      description: "crestview DMMS core Server API documentation.",
    },
    servers: [
      {
        url:appConfig.domain, 
        description: `crestview DMMS core Server `,
      },
    ],
  },
  apis: [path.resolve(__dirname, "../routes/*.ts"), path.resolve(__dirname, "../api-swagger-docs/docs/*.ts"),],
};
export default swaggerOptions;
