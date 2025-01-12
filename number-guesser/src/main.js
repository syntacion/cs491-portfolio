// Game variables
let targetNumber = Math.floor(Math.random() * 100) + 1
let attempts = 0

let lowerBound = 1
let upperBound = 100

// Get DOM elements
const guessInput = document.getElementById('guessInput')
const guessButton = document.getElementById('guessButton')
const recommendButton = document.getElementById('recommendButton')
const feedback = document.getElementById('feedback')
const attemptsDisplay = document.getElementById('attempts')

// Event listeners
guessButton.addEventListener('click', makeGuess)
recommendButton.addEventListener('click', recommendGuess)

// Functions
function makeGuess() {
  const guess = parseInt(guessInput.value)

  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = 'Please enter a valid number between 1 and 100.'
    return
  }

  attempts++
  attemptsDisplay.textContent = attempts

  if (guess > targetNumber) {
    upperBound = Math.min(upperBound, guess - 1)
    feedback.textContent = 'Too high! Try again.'
  } else if (guess < targetNumber) {
    lowerBound = Math.max(lowerBound, guess + 1)
    feedback.textContent = 'Too low! Try again.'
  } else {
    feedback.textContent = `Correct! You guessed the number in ${attempts} attempts.`
    guessButton.disabled = true
    recommendButton.disabled = true
  }
}

function recommendGuess() {
  const suggestedGuess = Math.floor((lowerBound + upperBound) / 2)
  feedback.textContent = `We recommend guessing: ${suggestedGuess}`
}
