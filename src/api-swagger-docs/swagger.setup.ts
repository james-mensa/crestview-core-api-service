import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import swaggerOptions from '@config/swagger.config';
import { appConfig } from '@config/appConfig';
const SERVICE_VERSION =`/api/${appConfig.api_version}`
const DOCS_PATH=`${SERVICE_VERSION}/docs`
export function setupSwagger(app: Application): void {
  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use( DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec,{
    customSiteTitle:"crestview management service"
  }));

  console.log(`API Docs available at http://localhost:${appConfig.host_port}${DOCS_PATH}`);
}
