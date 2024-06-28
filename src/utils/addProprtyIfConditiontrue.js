export function addPropertyIfConditionIsTrue(
  params,
  condition,
  property,
  value
) {
  if (condition) {
    params[property] = value;
  }
}
