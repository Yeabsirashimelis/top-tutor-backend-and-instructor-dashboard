import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Number of hashing rounds
  const hash = await bcrypt.hash(password, saltRounds); // Generate hash
  return hash;
};

export const verifyPassword = async ({
  hash,
  password,
}: {
  hash: string;
  password: string;
}): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash); // Compare password with the hash
  return isMatch;
};
