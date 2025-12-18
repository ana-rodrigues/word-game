/**
 * Pinpoint Game - Core Game Logic
 * 
 * Manages game state, clue reveal, answer validation, and dynamic content updates
 */

// ============================================================================
// GAME STATE
// ============================================================================

let gameState = {
  puzzles: [],
  currentPuzzleId: 1,
  revealedCluesCount: 1,
  guesses: [],
  status: 'playing', // 'playing', 'won', 'lost'
  uiState: 'playing', // 'playing' or 'results'
  startTime: null
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize input: lowercase and trim whitespace
 * @param {string} input - Raw input string
 * @returns {string} - Normalized string
 */
function normalizeInput(input) {
  return input.toLowerCase().trim();
}

/**
 * Validate player answer against accepted answers
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

/**
 * Get current puzzle object
 * @returns {object} - Current puzzle
 */
function getCurrentPuzzle() {
  return gameState.puzzles.find(p => p.id === gameState.currentPuzzleId);
}

/**
 * Get clues up to the revealed count
 * @returns {array} - Array of revealed clues
 */
function getRevealedClues() {
  const puzzle = getCurrentPuzzle();
  if (!puzzle) {
    console.error('No puzzle found for ID:', gameState.currentPuzzleId);
    return [];
  }
  return puzzle.clues.slice(0, gameState.revealedCluesCount);
}

// ============================================================================
// DOM MANIPULATION
// ============================================================================

/**
 * Update clues display
 */
function updateCluesDisplay() {
  const cluesContainer = document.getElementById('clues-container');
  const clueCount = document.getElementById('clue-count');
  const revealedClues = getRevealedClues();

  console.log('updateCluesDisplay called:', {
    revealedCluesCount: gameState.revealedCluesCount,
    revealedClues: revealedClues,
    cluesContainerExists: !!cluesContainer
  });

  // Get current number of clues in DOM
  const currentClueCount = cluesContainer.children.length;

  // Only add new clues that aren't already displayed
  for (let i = currentClueCount; i < revealedClues.length; i++) {
    const clueElement = document.createElement('div');
    clueElement.className = 'clue-item';
    clueElement.textContent = revealedClues[i];
    clueElement.setAttribute('data-clue-index', i);
    cluesContainer.appendChild(clueElement);
  }

  // Update clue counter
  clueCount.textContent = gameState.revealedCluesCount;

  // Scroll to the latest clue (important for mobile when keyboard is open)
  scrollToLatestClue();
}

/**
 * Scroll to the latest clue in the container
 */
function scrollToLatestClue() {
  const cluesContainer = document.getElementById('clues-container');
  if (!cluesContainer) return;

  const lastClue = cluesContainer.lastElementChild;
  if (lastClue) {
    // Use setTimeout to ensure the clue is rendered before scrolling
    setTimeout(() => {
      lastClue.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }
}

/**
 * Display feedback message
 * @param {string} message - Message to display
 * @param {string} type - 'error', 'success', or 'info'
 */
function displayFeedback(message, type = 'info') {
  const feedbackElement = document.getElementById('feedback-message');
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback-message ${type}`;
}

/**
 * Update guess counter display (if element exists)
 */
function updateGuessCounter() {
  const guessCounter = document.getElementById('guess-counter');
  if (guessCounter) {
    guessCounter.textContent = gameState.guesses.length;
  }
}

/**
 * Clear input field
 */
function clearInput() {
  const guessInput = document.getElementById('guess-input');
  guessInput.value = '';
  guessInput.focus();
}

/**
 * Set UI state (playing or results)
 * @param {string} state - 'playing' or 'results'
 */
function setUIState(state) {
  gameState.uiState = state;
  document.getElementById('game-screen').setAttribute('data-state', state);
}

// ============================================================================
// GAME LOGIC
// ============================================================================

/**
 * Initialize a new game with a specific puzzle
 * @param {number} puzzleId - ID of puzzle to load
 */
function initGame(puzzleId) {
  console.log('initGame called with puzzleId:', puzzleId);
  gameState.currentPuzzleId = puzzleId;
  gameState.revealedCluesCount = 1;
  gameState.guesses = [];
  gameState.status = 'playing';
  gameState.startTime = Date.now();

  console.log('gameState after init:', {
    currentPuzzleId: gameState.currentPuzzleId,
    revealedCluesCount: gameState.revealedCluesCount,
    puzzlesLoaded: gameState.puzzles.length
  });

  // Clear clues container for new game
  const cluesContainer = document.getElementById('clues-container');
  if (cluesContainer) {
    cluesContainer.innerHTML = '';
  }

  displayFeedback('', 'info');
  updateCluesDisplay();
  updateGuessCounter();
  clearInput();
  setUIState('playing');
}

/**
 * Process player guess
 * @param {string} guess - Player's guess
 */
function processGuess(guess) {
  if (!guess.trim()) {
    displayFeedback('Please enter a guess', 'error');
    return;
  }

  // Prevent guessing if game is already over
  if (gameState.status !== 'playing') {
    return;
  }

  const puzzle = getCurrentPuzzle();
  gameState.guesses.push(guess);
  updateGuessCounter();

  // Check if answer is correct
  if (validateAnswer(guess, puzzle.acceptedAnswers)) {
    gameState.status = 'won';
    displayFeedback('You won!', 'success');
    completeGame(true);
    return;
  }

  // Incorrect guess
  // Check if player has reached 5 incorrect guesses
  if (gameState.guesses.length >= 5) {
    // Player loses after 5 incorrect guesses
    gameState.status = 'lost';
    displayFeedback('Game over. Maximum guesses reached.', 'error');
    completeGame(false);
  } else {
    // Reveal next clue if available
    if (gameState.revealedCluesCount < 5) {
      gameState.revealedCluesCount++;
      updateCluesDisplay();
      displayFeedback('Incorrect! New clue revealed.', 'error');
      clearInput();
    } else {
      // All clues revealed but still have guesses left
      displayFeedback('Incorrect! Try again.', 'error');
      clearInput();
    }
  }
}

/**
 * Complete the game and show results
 * @param {boolean} won - Whether player won
 */
function completeGame(won) {
  const puzzle = getCurrentPuzzle();

  // Populate results screen
  const resultStatus = document.getElementById('result-status');
  resultStatus.textContent = won ? 'You won!' : 'Game over';
  resultStatus.className = `result-status ${won ? 'won' : 'lost'}`;

  // Display the correct answer
  document.getElementById('result-category').textContent = puzzle.category;

  // Switch to results state
  setUIState('results');
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const guessInput = document.getElementById('guess-input');
  const guess = guessInput.value;
  processGuess(guess);
}

/**
 * Handle next puzzle button
 */
function handleNextPuzzle() {
  const nextPuzzleId = gameState.currentPuzzleId + 1;
  
  if (nextPuzzleId <= gameState.puzzles.length) {
    initGame(nextPuzzleId);
  } else {
    // No more puzzles - show completion screen
    setUIState('completed');
    createConfetti();
  }
}

/**
 * Create confetti animation
 */
function createConfetti() {
  const confettiContainer = document.getElementById('confetti-container');
  if (!confettiContainer) return;

  // Clear any existing confetti
  confettiContainer.innerHTML = '';

  // Create 20 confetti pieces
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confettiContainer.appendChild(confetti);
  }
}

/**
 * Handle replay button
 */
function handleReplay() {
  initGame(gameState.currentPuzzleId);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Load puzzles from JSON file
 */
async function loadPuzzles() {
  try {
    console.log('Attempting to load puzzles from data/puzzles.json');
    const response = await fetch('data/puzzles.json');
    console.log('Fetch response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    gameState.puzzles = data.puzzles;
    console.log(`Loaded ${gameState.puzzles.length} puzzles:`, gameState.puzzles);
  } catch (error) {
    console.error('Error loading puzzles:', error);
    console.error('Make sure you are running this from a local web server, not file://');
    displayFeedback('Error loading puzzles. Please refresh the page.', 'error');
  }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  const guessForm = document.getElementById('guess-form');
  const nextPuzzleBtn = document.getElementById('next-puzzle-btn');
  const replayBtn = document.getElementById('replay-btn');
  const guessInput = document.getElementById('guess-input');

  if (guessForm) {
    guessForm.addEventListener('submit', handleFormSubmit);
  }
  if (nextPuzzleBtn) {
    nextPuzzleBtn.addEventListener('click', handleNextPuzzle);
  }
  if (replayBtn) {
    replayBtn.addEventListener('click', handleReplay);
  }
  
  // Scroll to latest clue when input is focused (mobile keyboard opens)
  if (guessInput) {
    guessInput.addEventListener('focus', () => {
      // Delay to allow keyboard to open and viewport to resize
      setTimeout(() => {
        scrollToLatestClue();
      }, 300);
    });
  }
}

/**
 * Initialize the app
 */
async function initApp() {
  console.log('Initializing Pinpoint Game...');
  
  // Load puzzles
  await loadPuzzles();
  
  // Set up event listeners
  setupEventListeners();
  
  // Start first game
  if (gameState.puzzles.length > 0) {
    initGame(1);
    console.log('Game started');
  } else {
    displayFeedback('No puzzles available. Please check data/puzzles.json', 'error');
  }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
