// This is a placeholder for real password hashing which would use bcrypt
// In a real application, you should use bcrypt or another secure hashing library

export const hashPassword = async (password: string): Promise<string> => {
  // In a real app we would use: return await bcrypt.hash(password, 10);
  return password; // Placeholder - NOT secure
};

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  // In a real app we would use: return await bcrypt.compare(plainPassword, hashedPassword);
  return plainPassword === hashedPassword; // Placeholder - NOT secure
};
