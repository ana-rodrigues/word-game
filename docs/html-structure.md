# HTML Structure Documentation

## Overview

The `index.html` file uses semantic HTML5 markup with a clean, minimal structure optimized for gameplay. It's organized into a single game screen with results actions, controlled by JavaScript during gameplay.

## Structure Breakdown

### 1. Document Setup
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pinpoint Game</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
```

**Key Elements:**
- `lang="en"`: Language declaration for accessibility
- `charset="UTF-8"`: Character encoding
- `viewport` meta tag: Responsive design support
- CSS link: Stylesheet reference

### 2. Main App Container
```html
<div id="app">
    <h1 class="visually-hidden">Pinpoint</h1>
    <main>
        <!-- Game content -->
    </main>
</div>
```

**Purpose:** Single root element for JavaScript manipulation and styling

**Note:** The `<h1>` is visually hidden using the `.visually-hidden` CSS class but remains in the DOM for accessibility and SEO purposes.

### 3. Main Content Area
```html
<main>
    <section id="game-screen" class="screen active">
        <!-- Game content -->
    </section>
    <div class="results-actions">
        <!-- Navigation buttons -->
    </div>
</main>
```

**Purpose:** Semantic container for main content

### 4. Game Screen (Active During Gameplay)

#### Clue Display Section
```html
<div class="clue-section">
    <p class="clue-label">Clues revealed:</p>
    <div id="clues-container" class="clues-container">
        <!-- Clues dynamically inserted by JavaScript -->
    </div>
    <p class="clue-counter">
        <span id="clue-count">1</span> / 5
    </p>
</div>
```

**Elements:**
- `clue-label`: Label for clues section
- `clues-container`: Container for clue elements (dynamically populated)
- `clue-count`: Current number of revealed clues (updates with each wrong guess)

**JavaScript Interaction:**
- Clues inserted as child elements of `clues-container`
- `clue-count` text content updated when new clue revealed

#### Input Section
```html
<div class="input-section">
    <form id="guess-form">
        <div class="form-group">
            <label for="guess-input">Your guess:</label>
            <input
                type="text"
                id="guess-input"
                placeholder="Enter the category..."
                autocomplete="off"
                required
            >
        </div>
        <button type="submit" id="submit-btn">Submit</button>
    </form>
</div>
```

**Elements:**
- `<form>`: Form wrapper for semantic structure
- `<label>`: Accessibility - associated with input via `for` attribute
- `<input>`: Text input for player guess
  - `autocomplete="off"`: Prevent browser autocomplete
  - `required`: HTML5 validation
- `<button type="submit">`: Form submission button

**JavaScript Interaction:**
- Listen for form submission
- Get input value via `guess-input`
- Validate and process guess

#### Feedback Message
```html
<div id="feedback-message" class="feedback-message" role="alert" aria-live="polite">
    <!-- Feedback will be displayed here -->
</div>
```

**Accessibility:**
- `role="alert"`: Announces changes to screen readers
- `aria-live="polite"`: Announces updates without interrupting
- Used for: "Incorrect! Try again." or "Correct! You won!"

#### Game Stats
```html
<div class="game-stats">
    <span class="clue-counter">
        <span id="clue-count">1</span> / 5 clues
    </span>
</div>
```

**Purpose:** Display current clue count

**JavaScript Interaction:**
- `clue-count` updated when new clue revealed

**Layout:** Centered display below submit button

**Note:** Guess count removed from UI (redundant with clue count), but still tracked internally for results screen and game logic

### 5. Results Screen

```html
<div class="results-content">
    <div id="result-status" class="result-status" role="alert">
        <!-- Result message (Won/Lost) -->
    </div>

    <div class="result-answer">
        <p class="answer-label">The answer was:</p>
        <p id="result-category" class="answer-value"></p>
    </div>

    <div class="results-actions">
        <button id="next-puzzle-btn" class="action-btn">Next Puzzle</button>
        <button id="replay-btn" class="action-btn">Replay</button>
    </div>
</div>
```

**Purpose:** Display game result and navigation options

**Content:**
- Result status: "✓ You Won!" or "✗ Game Over"
- Correct answer: The category name
- Navigation buttons: Next Puzzle and Replay

**JavaScript Interaction:**
- `result-status` populated with win/loss message
- `result-category` populated with correct answer
- Buttons trigger puzzle navigation

### 6. Scripts
```html
<script src="js/game.js"></script>
```

**Placement:** End of body (best practice for performance)

## Screen Management

### State-Based UI with Data Attributes

The page uses a single game screen with two distinct states managed via the `data-state` attribute:

```html
<section id="game-screen" class="screen active" data-state="playing">
    <div class="playing-content">
        <!-- Gameplay UI: clues, input form, feedback -->
    </div>
    <div class="results-content">
        <!-- Results UI: status, stats, clues, navigation -->
    </div>
</section>
```

**State Management:**
- `data-state="playing"`: Shows gameplay UI (clues, input form)
- `data-state="results"`: Shows results UI (status, stats, clues)

**CSS Attribute Selectors:**
```css
#game-screen[data-state="playing"] .playing-content { display: block; }
#game-screen[data-state="playing"] .results-content { display: none; }

#game-screen[data-state="results"] .playing-content { display: none; }
#game-screen[data-state="results"] .results-content { display: block; }
```

**JavaScript Control:**
```javascript
setUIState('playing');  // Show gameplay
setUIState('results');  // Show results
```

**Benefits:**
- Single source of truth: `data-state` attribute
- All styling in CSS (separation of concerns)
- Scalable: easy to add new states
- Declarative: state visible in DOM inspector

## Key IDs for JavaScript

| ID | Purpose |
|---|---|
| `game-screen` | Main game container (holds data-state) |
| `clues-container` | Container for clue elements |
| `clue-count` | Current clue count display (playing state) |
| `guess-form` | Form for submission |
| `guess-input` | Player input field |
| `submit-btn` | Submit button |
| `feedback-message` | Feedback display during gameplay |
| `result-status` | Result message (Won/Lost) |
| `result-category` | Correct answer display |
| `next-puzzle-btn` | Next puzzle button |
| `replay-btn` | Replay button |

## Accessibility Features

1. **Semantic HTML**: Uses `<main>`, `<section>`, `<form>`
2. **Visually Hidden Title**: `<h1 class="visually-hidden">` for SEO and screen readers
3. **Labels**: `<label>` associated with input via `for` attribute
4. **ARIA Attributes**: 
   - `role="alert"` on feedback message
   - `aria-live="polite"` for dynamic updates
5. **Language**: `lang="en"` on `<html>` element
6. **Form Validation**: HTML5 `required` attribute

## Dynamic Content Updates

JavaScript will dynamically update content in:

1. **Clues Container**: Clue elements added/updated here
2. **Clue Counter**: Updated when new clue revealed
3. **Feedback Message**: Text updated with game feedback
4. **Guess Counter**: Updated after each guess

## Simplified Structure

The HTML has been streamlined for a focused gameplay experience:
- Removed separate header element (title now visually hidden)
- Removed separate results screen (results display inline)
- Results actions buttons always visible for navigation
- Single game container with dynamic content updates
- Minimal markup for cleaner DOM and easier styling
