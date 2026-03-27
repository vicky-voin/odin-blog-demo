const { prisma } = require("../../lib/prisma");

exports.getWithId = async (postId) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  return post;
};
