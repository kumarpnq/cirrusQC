export default function getHeaderAbbreviation(header) {
  switch (header) {
    case "CLIENT NAME":
      return "CLIENT";
    case "REPORTING TONE":
      return "TONE";
    case "REPORTING SUBJECT":
      return "SUBJECT";
    case "SUBCATEGORY":
      return "SUBCATE";
    case "DETAIL SUMMARY":
      return "SUMMARY";
    case "COMPANY NAME":
      return "COMPANY";
    case "AUTHOR NAME":
      return "AUTHOR";
    case "QC1 DONE":
      return "QC1";
    case "QC2 DONE":
      return "QC2";
    case "SOCIAL FEED ID":
      return "FEED-ID";
    case "FEED DATE TIME":
      return "FEED-DATE";
    case "UPLOAD DATE":
      return "UPLOAD";
    case "HAS IMAGE":
      return "IMAGE";
    case "HAS VIDEO":
      return "VIDEO";
    default:
      return header;
  }
}
