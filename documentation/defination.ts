export default {
  definitions: {
    blogs: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        content: { type: "string" },
        author: { type: "string" },
        likes: { type: "number" },
      },
    },
    users: {
      type: "object",
      properties: {
        id: { type: "number" },
        username: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        image: { type: "string" },
        role: { type: "string", enum: ["USER", "ADMIN"], default: ["USER"] },
      },
    },
  },
};
