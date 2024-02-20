export default {
  paths: {
    "/blogs": {
      get: {
        tags: ["Blogs"],
        summary: "Get all the blog",
        description: "Returns all the blogs",
        consumes: ["application/json"],
        produces: ["application/json"],
        responses: {
          200: {
            description: "successful operation",
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
          500: {
            description: "Internal Server Errror",
          },
        },
      },
      post: {
        tags: ["Blogs"],
        summary: "Create a new Blog",
        description: "Post a blog in the list of blog",
        operation: "post",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Content for creation of new blog",
            required: true,
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
        ],
        responses: {
          201: {
            description: "Successful Operation",
            schema: {
              $ref: "#/definitions/blogs",
            },
          },
          200: {
            description: "Created Successfully",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
    "/blogs/{id}": {
      get: {
        tags: ["Blogs"],
        summary: "Find a single blog",
        description: "Returns a particular blog using an id",
        produces: ["appliccation/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of blog to be return ",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "Successful Request",
            schema: {
              $ref: "#definitions/blogs",
            },
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
      delete: {
        tags: ["Blogs"],
        summary: "Delete a single blog",
        description: "Delete a particular blog with that id",
        produces: ["appliccation/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of a blog to be deleted",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "Successful Operation",
            schema: {
              $ref: "#definitions/blogs",
            },
          },
          204: {
            description: "Blog deleted successfully",
          },
          404: {
            description: "Blog not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
      put: {
        tags: ["Blogs"],
        summary: "Update the blog",
        description: "Update the blog of that id",
        operadionId: "update",
        produces: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "ID of the blog to be updated",
            required: true,
            type: "string",
          },
          {
            in: "body",
            name: "body",
            description: "Content for updating the blog",
            required: true,
            schema: {
              $ref: "#definitions/blogs",
            },
          },
        ],
        responses: {
          200: {
            description: "Successful Request",
            schema: {
              $ref: "#definitions/blogs",
            },
          },
          404: {
            description: "Blog not found",
          },
          500: {
            description: "Internal Server Error",
          },
        },
      },
    },
  },
};
