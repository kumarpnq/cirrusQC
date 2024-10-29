export function mapBinaryToYesNoAll(value) {
  switch (value) {
    case 1:
      return "Y";
    case "0":
      return "N";
    case 2:
      return "ALL";
    case 3:
      return "PY";
    case 4:
      return "PN";
    default:
      return value;
  }
}
