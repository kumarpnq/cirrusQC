export function isDomainIncluded(url, domain) {
  const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(?:https?:\/\/)?(?:www\.)?${escapedDomain}`, "i");
  return regex.test(url);
}
