// const apiLocation = process.env.BASE_URL; // Set this to the hostname of your API server
// const apiVersion = "api/v1/";

export default {
  swagger: "2.0", // Change this to the correct version of Swagger you're using
  info: {
    title: "Blog System API Documentation",
    version: "1.0",
    description:
      "This is API Documentation for this blog application made with Express and documented with Swagger.",
    license: {
      name: "MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      email: "sunarakash1122@gmail.com",
    },
  },
  schemes: ["http", "https"],
  host: "localhost:3003",
  basePath: "/api/v1",
};
