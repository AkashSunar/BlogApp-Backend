
// const apiLocation = process.env.BASE_URL;
import swaggerJsdoc from "swagger-jsdoc";
const options = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        email: "sunarakash1122@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3003",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.ts"], // Path to the API routes
};
const specs = swaggerJsdoc(options);
export default specs;