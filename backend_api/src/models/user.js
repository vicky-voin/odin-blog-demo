const { prisma } = require("../../lib/prisma");

exports.getWithId = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

exports.getWithEmail = async (userEmail) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });

  return user;
};

exports.register = async ({ name, email, password }) => {
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });

  console.log("Registered user with email: ", user.email);
};
