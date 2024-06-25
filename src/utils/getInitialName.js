export function getInitials(userName) {
  const parts = userName.split(/[^a-zA-Z]/);
  if (parts.length === 1) {
    // If the username doesn't contain separators, use the first two characters
    return userName.slice(0, 2).toUpperCase();
  } else {
    // Otherwise, use the first character of the first and last parts
    const initials = parts[0][0] + parts[parts.length - 1][0];
    return initials.toUpperCase();
  }
}
