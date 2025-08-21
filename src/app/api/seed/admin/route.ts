import { auth } from "@/lib/auth";

export const GET = async function () {
  const data = {
    email: "yes@gmail.com",
    password: "12345678",
  };

  try {
    await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: "master",
        firstName: "ABEBE",
        lastName: "BALCHA",
      },
    });

    return new Response("Admin account created successfully", {
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return new Response((error as Error).message, { status: 500 });
  }
};
