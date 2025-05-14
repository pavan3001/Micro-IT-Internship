function appendToDisplay(value) {
  document.getElementById('display').value += value;
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function calculateResult() {
  const display = document.getElementById('display');
  try {
    display.value = eval(display.value);
  } catch {
    display.value = 'Error';
  }
}

// ✅ Keyboard support
document.addEventListener('keydown', function (event) {
  const key = event.key;
  const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.'];

  if (allowedKeys.includes(key)) {
    appendToDisplay(key);
  } else if (key === 'Enter') {
    event.preventDefault(); // prevent form submit behavior
    calculateResult();
  } else if (key === 'Backspace') {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
  } else if (key === 'Escape') {
    clearDisplay();
  }
});
