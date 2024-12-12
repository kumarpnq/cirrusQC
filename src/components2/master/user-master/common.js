export const generatePassword = (userName, loginName) => {
  const specialChars = "!@#$%^&*";
  const randomSpecialChar =
    specialChars[Math.floor(Math.random() * specialChars.length)];
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  return `${userName}_${loginName}${randomSpecialChar}${randomSuffix}`;
};
