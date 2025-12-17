# Pinpoint Game Clone

A web-based clone of LinkedIn's Pinpoint puzzle game built with vanilla HTML, CSS, and JavaScript. Players guess a category that connects five clue words, with clues revealed progressively after each incorrect guess.

## Project Structure

```
word-game/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Stylesheet (unstyled initially)
├── js/
│   └── game.js             # Core game logic
├── data/
│   └── puzzles.json        # Puzzle data (static content)
├── context/
│   ├── prd.md              # Product requirements document
│   └── technical-architecture.md
└── README.md               # This file
```

## Features

- **Progressive Clue Reveal**: Start with 1 clue, reveal more with each incorrect guess
- **Answer Validation**: Strict matching against accepted answers
- **Guess Tracking**: Count guesses and display results
- **Multiple Puzzles**: Support for many puzzles in local JSON
- **No Backend**: All content stored locally
- **Vanilla JavaScript**: No dependencies or frameworks
- **Responsive Design**: Works on all modern browsers

## Getting Started

1. Open `index.html` in your web browser
2. Or use a local development server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using PHP
   php -S localhost:8000
   ```
3. Navigate to `http://localhost:8000` in your browser

## How to Play

1. You'll see the first clue word
2. Type the category you think connects all the clues
3. If correct, you win! If incorrect, the next clue appears
4. Keep guessing until you find the right category or run out of clues
5. Your score is based on how many guesses it took

## Development Phases

- **Phase 1**: Project setup & documentation ✓
- **Phase 2**: Data structure & puzzle data
- **Phase 3**: HTML structure (unstyled)
- **Phase 4**: Core game logic
- **Phase 5**: Results tracking
- **Phase 6**: Multi-puzzle navigation
- **Phase 7**: Styling
- **Phase 8**: Testing & polish

## Documentation

- **PRD**: See `context/prd.md` for product requirements
- **Architecture**: See `context/technical-architecture.md` for technical details

## Browser Support

Works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Free to use for personal and commercial projects.
