# Test Suite

Automated tests for validating game acceptance criteria.

## Running Tests

```bash
node tests/validation.test.js
```

## Test Coverage

### validation.test.js

Validates the acceptance criteria:
> "Flexible Answer Validation: The acceptedAnswers array handles plurals, synonyms, and regional spelling differences (e.g., "fruits"/"fruit", "colours"/"colors"). JavaScript normalizes player input (lowercase, trim) before comparing."

**Test Groups:**

1. **Plural/Singular Handling** (3 tests)
   - Accept singular when plural expected
   - Accept plural when singular expected
   - Reject unrelated words

2. **Regional Spelling Differences** (3 tests)
   - British spelling (colours)
   - American spelling (colors)
   - Singular variations (color)

3. **Synonyms and Variations** (4 tests)
   - Exact matches
   - Singular variations
   - Shortened synonyms
   - Alternative phrasings

4. **Case Normalization** (3 tests)
   - UPPERCASE input
   - MixedCase input
   - lowercase input

5. **Whitespace Trimming** (4 tests)
   - Leading whitespace
   - Trailing whitespace
   - Both sides
   - Tabs and newlines

6. **Combined Normalization** (2 tests)
   - Case + whitespace together
   - Multi-word inputs

7. **Edge Cases** (4 tests)
   - Empty strings
   - Whitespace-only strings
   - Partial matches
   - Similar but different words

**Total: 23 tests**

## Test Results

✓ All 23 tests pass
✓ Acceptance criteria met

## Functions Tested

### `normalizeInput(input)`
Normalizes player input by:
- Converting to lowercase
- Trimming leading/trailing whitespace

### `validateAnswer(playerInput, acceptedAnswers)`
Validates player answer by:
- Normalizing player input
- Comparing against each normalized accepted answer
- Returning true if any match found

## Integration

These functions will be integrated into `js/game.js` during Phase 4 (Core Game Logic).

The test file can be:
- Run standalone with Node.js
- Imported as a module for integration tests
- Extended with additional test cases
