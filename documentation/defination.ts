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
  },
};
