const syntaxRules = {
  operators: {
    boolean: ["AND", "OR", "NOT", "&&", "||", "!"],
    comparison: [":", "=", "<=", ">=", "<", ">"],
    range: ["TO"],
    proximity: ["~"],
    boost: ["^"],
    wildcard: ["*", "?"],
  },
  specialCharacters: [
    "+",
    "-",
    "=",
    "&&",
    "||",
    ">",
    "<",
    "!",
    "(",
    ")",
    "{",
    "}",
    "[",
    "]",
    "^",
    '"',
    "~",
    "*",
    "?",
    ":",
    "\\",
    "/",
  ],
  escapeCharacter: "\\",
  fieldModifiers: ["_exists_", "_missing_"],
  reserved: [
    "_exists_",
    "_missing_",
    "_cache",
    "_type",
    "_doc",
    "_field_names",
    "_id",
    "_index",
    "_routing",
    "_source",
    "_version",
  ],
};
export const validateQuery = (inputQuery, setIsValid, setError) => {
  try {
    const errors = [];

    // Check basic syntax
    // 1. Parentheses matching
    const openParens = (inputQuery.match(/\(/g) || []).length;
    const closeParens = (inputQuery.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push("Unmatched parentheses");
    }

    // 2. Quotes matching
    const quotes = (inputQuery.match(/(?<!\\)"/g) || []).length;
    if (quotes % 2 !== 0) {
      errors.push("Unmatched quotes");
    }

    // 3. Valid boolean operators
    const words = inputQuery.split(/\s+/);
    words.forEach((word, index) => {
      if (
        ["and", "or", "not"].includes(word.toLowerCase()) &&
        !syntaxRules.operators.boolean.includes(word)
      ) {
        errors.push(`Boolean operator ${word} should be uppercase`);
      }
    });

    // 4. Range syntax validation
    const ranges = inputQuery.match(/[\[\{].+TO.+[\]\}]/g) || [];
    ranges.forEach((range) => {
      if (!range.match(/[\[\{][^\[\]\{\}]+TO[^\[\]\{\}]+[\]\}]/)) {
        errors.push(
          "Invalid range syntax. Use format: [min TO max] or {min TO max}"
        );
      }
    });

    // 5. Field name validation
    const fieldPattern = /([a-zA-Z_][a-zA-Z0-9._-]*)\s*:/g;
    let match;
    while ((match = fieldPattern.exec(inputQuery)) !== null) {
      const fieldName = match[1];
      if (syntaxRules.reserved.includes(fieldName)) {
        errors.push(`'${fieldName}' is a reserved field name`);
      }
    }

    // 6. Boost value validation
    const boostValues = inputQuery.match(/\^-?\d+\.?\d*/g) || [];
    boostValues.forEach((boost) => {
      const value = parseFloat(boost.substring(1));
      if (value <= 0) {
        errors.push("Boost values must be positive numbers");
      }
    });

    // 7. Proximity search validation
    const proximitySearches = inputQuery.match(/"[^"]+"\s*~\s*\d+/g) || [];
    proximitySearches.forEach((prox) => {
      const value = parseInt(prox.split("~")[1]);
      if (isNaN(value) || value < 0) {
        errors.push("Proximity values must be positive integers");
      }
    });

    // 8. Wildcard validation
    if (inputQuery.match(/^\*/) || inputQuery.match(/^\?/)) {
      errors.push(
        "Leading wildcards are not recommended (high performance impact)"
      );
    }

    setIsValid(errors.length === 0);
    setError(errors.join(". "));
  } catch (e) {
    setIsValid(false);
    setError("Invalid query syntax");
  }
};

export const generateSuggestions = (inputQuery, cursorPos, setSuggestions) => {
  const suggestions = [];
  const beforeCursor = inputQuery.substring(0, cursorPos);
  const words = beforeCursor.split(/\s+/);
  const currentWord = words[words.length - 1] || "";

  // Field suggestions
  if (currentWord.endsWith(":")) {
    suggestions.push(
      '"exact phrase"',
      "[min TO max]",
      "{min TO max}",
      "*wildcard*",
      "/regex/",
      ">value",
      ">=value",
      "<value",
      "<=value"
    );
  }

  // Boolean operator suggestions
  const previousWord = words[words.length - 2] || "";
  if (
    previousWord &&
    !syntaxRules.operators.comparison.includes(previousWord)
  ) {
    syntaxRules.operators.boolean.forEach((op) => {
      if (op.toLowerCase().startsWith(currentWord.toLowerCase())) {
        suggestions.push(op);
      }
    });
  }

  // Wildcard and fuzzy suggestions
  if (
    currentWord.length > 2 &&
    !currentWord.includes("*") &&
    !currentWord.includes("?")
  ) {
    suggestions.push(
      `${currentWord}*`,
      `*${currentWord}*`,
      `${currentWord}~1`,
      `${currentWord}~2`
    );
  }

  // Range suggestions
  if (currentWord.match(/^\d+$/)) {
    suggestions.push(
      `[${currentWord} TO *]`,
      `{${currentWord} TO *}`,
      `[* TO ${currentWord}]`,
      `{* TO ${currentWord}}`
    );
  }

  setSuggestions(suggestions);
};

export const generateAutoQuery = (formValues) => {
  const { companyName, ceo, products, keyPeoples, companyKeywords } =
    formValues;

  // Ensure companyName is always present
  if (!companyName) {
    throw new Error("Company name is required for generating a query.");
  }

  // Helper function to wrap terms in quotes for exact match
  const quote = (term) => `"${term.trim()}"`;

  // Start with the company name
  let query = `${quote(companyName)}`;

  // Collect optional conditions to be combined with OR
  const conditions = [];

  // Add CEO condition
  if (ceo) {
    conditions.push(`(${quote(companyName)} AND ${quote(ceo)})`);
  }

  // Add Products condition
  if (products) {
    conditions.push(`(${quote(companyName)} AND ${quote(products)})`);
  }

  // Combine keyPeoples and companyKeywords into one OR group
  const additionalConditions = [];

  if (keyPeoples) {
    const keyPeoplesArray = keyPeoples
      .split(",")
      .map((person) => quote(person));
    additionalConditions.push(...keyPeoplesArray);
  }

  if (companyKeywords) {
    const keywordsArray = companyKeywords
      .split(",")
      .map((keyword) => quote(keyword));
    additionalConditions.push(...keywordsArray);
  }

  if (additionalConditions.length > 0) {
    conditions.push(
      `(${quote(companyName)} OR ${additionalConditions.join(" OR ")})`
    );
  }

  // Combine all conditions with OR
  if (conditions.length > 0) {
    query += ` OR ${conditions.join(" OR ")}`;
  }

  return query;
};
