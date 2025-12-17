/**
 * Validation Tests for Answer Matching
 * 
 * Acceptance Criteria:
 * "Flexible Answer Validation: The acceptedAnswers array handles plurals, synonyms, 
 * and regional spelling differences (e.g., "fruits"/"fruit", "colours"/"colors"). 
 * JavaScript normalizes player input (lowercase, trim) before comparing."
 */

// Mock puzzle data for testing
const mockPuzzles = {
  pluralTest: {
    category: "fruits",
    acceptedAnswers: ["fruits", "fruit"]
  },
  regionalSpellingTest: {
    category: "colours",
    acceptedAnswers: ["colours", "colors", "color"]
  },
  synonymTest: {
    category: "programming languages",
    acceptedAnswers: ["programming languages", "programming language", "languages", "coding languages"]
  },
  mixedCaseTest: {
    category: "animals",
    acceptedAnswers: ["animals", "animal"]
  },
  whitespaceTest: {
    category: "sports",
    acceptedAnswers: ["sports"]
  }
};

/**
 * Normalize input: lowercase and trim whitespace
 * This function will be used in the actual game logic
 */
function normalizeInput(input) {
  return input.toLowerCase().trim();
}

/**
 * Check if player answer matches accepted answers
 * @param {string} playerInput - Raw input from player
 * @param {array} acceptedAnswers - Array of valid answers
 * @returns {boolean} - True if input matches any accepted answer
 */
function validateAnswer(playerInput, acceptedAnswers) {
  const normalized = normalizeInput(playerInput);
  return acceptedAnswers.some(answer => 
    normalizeInput(answer) === normalized
  );
}

// ============================================================================
// TEST SUITE
// ============================================================================

class TestRunner {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(description, testFn) {
    try {
      testFn();
      this.passed++;
      this.tests.push({ description, status: "✓ PASS", error: null });
      console.log(`✓ PASS: ${description}`);
    } catch (error) {
      this.failed++;
      this.tests.push({ description, status: "✗ FAIL", error: error.message });
      console.error(`✗ FAIL: ${description}`);
      console.error(`  Error: ${error.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message} | Expected: ${expected}, Got: ${actual}`);
    }
  }

  summary() {
    console.log("\n" + "=".repeat(70));
    console.log("TEST SUMMARY");
    console.log("=".repeat(70));
    console.log(`Total Tests: ${this.passed + this.failed}`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log("=".repeat(70) + "\n");
    
    if (this.failed === 0) {
      console.log("✓ ALL TESTS PASSED - Acceptance criteria met!");
    } else {
      console.log("✗ SOME TESTS FAILED - Acceptance criteria NOT met");
    }
    
    return this.failed === 0;
  }
}

// ============================================================================
// RUN TESTS
// ============================================================================

const runner = new TestRunner();

console.log("\n" + "=".repeat(70));
console.log("ANSWER VALIDATION TEST SUITE");
console.log("=".repeat(70) + "\n");

// TEST GROUP 1: Plural/Singular Handling
console.log("GROUP 1: Plural/Singular Handling");
console.log("-".repeat(70));

runner.test("Should accept singular form when plural is expected", () => {
  const result = validateAnswer("fruit", mockPuzzles.pluralTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept singular 'fruit'");
});

runner.test("Should accept plural form when singular is expected", () => {
  const result = validateAnswer("fruits", mockPuzzles.pluralTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept plural 'fruits'");
});

runner.test("Should reject unrelated word", () => {
  const result = validateAnswer("vegetables", mockPuzzles.pluralTest.acceptedAnswers);
  runner.assert(result === false, "Should not accept 'vegetables' for fruits puzzle");
});

// TEST GROUP 2: Regional Spelling Differences
console.log("\nGROUP 2: Regional Spelling Differences");
console.log("-".repeat(70));

runner.test("Should accept British spelling 'colours'", () => {
  const result = validateAnswer("colours", mockPuzzles.regionalSpellingTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept British spelling 'colours'");
});

runner.test("Should accept American spelling 'colors'", () => {
  const result = validateAnswer("colors", mockPuzzles.regionalSpellingTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept American spelling 'colors'");
});

runner.test("Should accept singular American spelling 'color'", () => {
  const result = validateAnswer("color", mockPuzzles.regionalSpellingTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept singular 'color'");
});

// TEST GROUP 3: Synonyms and Variations
console.log("\nGROUP 3: Synonyms and Variations");
console.log("-".repeat(70));

runner.test("Should accept exact match 'programming languages'", () => {
  const result = validateAnswer("programming languages", mockPuzzles.synonymTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept 'programming languages'");
});

runner.test("Should accept singular variation 'programming language'", () => {
  const result = validateAnswer("programming language", mockPuzzles.synonymTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept 'programming language'");
});

runner.test("Should accept shortened synonym 'languages'", () => {
  const result = validateAnswer("languages", mockPuzzles.synonymTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept 'languages'");
});

runner.test("Should accept alternative phrasing 'coding languages'", () => {
  const result = validateAnswer("coding languages", mockPuzzles.synonymTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept 'coding languages'");
});

// TEST GROUP 4: Case Normalization
console.log("\nGROUP 4: Case Normalization");
console.log("-".repeat(70));

runner.test("Should accept UPPERCASE input", () => {
  const result = validateAnswer("ANIMALS", mockPuzzles.mixedCaseTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept uppercase 'ANIMALS'");
});

runner.test("Should accept MixedCase input", () => {
  const result = validateAnswer("AnImAlS", mockPuzzles.mixedCaseTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept mixed case 'AnImAlS'");
});

runner.test("Should accept lowercase input", () => {
  const result = validateAnswer("animals", mockPuzzles.mixedCaseTest.acceptedAnswers);
  runner.assert(result === true, "Failed to accept lowercase 'animals'");
});

// TEST GROUP 5: Whitespace Trimming
console.log("\nGROUP 5: Whitespace Trimming");
console.log("-".repeat(70));

runner.test("Should trim leading whitespace", () => {
  const result = validateAnswer("   sports", mockPuzzles.whitespaceTest.acceptedAnswers);
  runner.assert(result === true, "Failed to trim leading whitespace");
});

runner.test("Should trim trailing whitespace", () => {
  const result = validateAnswer("sports   ", mockPuzzles.whitespaceTest.acceptedAnswers);
  runner.assert(result === true, "Failed to trim trailing whitespace");
});

runner.test("Should trim both leading and trailing whitespace", () => {
  const result = validateAnswer("   sports   ", mockPuzzles.whitespaceTest.acceptedAnswers);
  runner.assert(result === true, "Failed to trim both sides");
});

runner.test("Should handle tabs and newlines", () => {
  const result = validateAnswer("\t\nsports\n\t", mockPuzzles.whitespaceTest.acceptedAnswers);
  runner.assert(result === true, "Failed to handle tabs and newlines");
});

// TEST GROUP 6: Combined Normalization
console.log("\nGROUP 6: Combined Normalization (Case + Whitespace)");
console.log("-".repeat(70));

runner.test("Should handle UPPERCASE with leading/trailing spaces", () => {
  const result = validateAnswer("   FRUITS   ", mockPuzzles.pluralTest.acceptedAnswers);
  runner.assert(result === true, "Failed to handle uppercase with spaces");
});

runner.test("Should handle MixedCase with internal spaces (multi-word)", () => {
  const result = validateAnswer("  PROGRAMMING LANGUAGES  ", mockPuzzles.synonymTest.acceptedAnswers);
  runner.assert(result === true, "Failed to handle mixed case multi-word with spaces");
});

// TEST GROUP 7: Edge Cases
console.log("\nGROUP 7: Edge Cases");
console.log("-".repeat(70));

runner.test("Should reject empty string", () => {
  const result = validateAnswer("", mockPuzzles.pluralTest.acceptedAnswers);
  runner.assert(result === false, "Should reject empty string");
});

runner.test("Should reject whitespace-only string", () => {
  const result = validateAnswer("   ", mockPuzzles.pluralTest.acceptedAnswers);
  runner.assert(result === false, "Should reject whitespace-only string");
});

runner.test("Should reject partial matches", () => {
  const result = validateAnswer("fruit", ["fruits only"]);
  runner.assert(result === false, "Should not accept partial match 'fruit' for 'fruits only'");
});

runner.test("Should reject similar but different words", () => {
  // "sport" should NOT match "sports" - they are different words
  // Only exact normalized matches should pass
  const result = validateAnswer("sport", mockPuzzles.whitespaceTest.acceptedAnswers);
  runner.assert(result === false, "Should not accept 'sport' when only 'sports' and 'sport' are accepted");
});

// Print summary
const allPassed = runner.summary();

// Export for use in other environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateAnswer,
    normalizeInput,
    TestRunner,
    allPassed
  };
}
