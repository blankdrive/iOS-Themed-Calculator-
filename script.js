document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const digitButtons = document.querySelectorAll('.calc-button.digit');
    const operatorButtons = document.querySelectorAll('.calc-button.divide, .calc-button.multiply, .calc-button.minus, .calc-button.plus');
    const equalsButton = document.querySelector('.calc-button.equals');
    const clearButton = document.querySelector('.calc-button.ac');
    const toggleSignButton = document.querySelector('.calc-button.sign-toggle');
    const percentButton = document.querySelector('.calc-button.percent');
    let currentInput = '';
    let previousInput = '';
    let currentOperator = null;
    let hasDecimal = false;

    function updateDisplay() {
        display.textContent = currentInput || '0';
    }

    function handleDigit(value) {
        if (currentInput.length < 13) {  // Limit the length of the calculation to 13
            if (value === '.') {
                if (!currentInput) {
                    currentInput = '0';
                }
                if (!hasDecimal) {
                    currentInput += value;
                    hasDecimal = true;
                }
            } else {
                currentInput += value;
            }
        }
        updateDisplay();
    }

    function handleOperator(operator) {
        if (currentInput) {
            if (previousInput && currentOperator) {
                calculate();
            } else {
                previousInput = currentInput;
            }
            currentInput = '';
            currentOperator = operator;
            hasDecimal = false;
        }
    }
    // Buttons

    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (currentOperator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '✕':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            default:
                return;
        }

        currentInput = result.toString().slice(0, 13); // Limit the result to 13 digits
        currentOperator = null;
        previousInput = '';
        updateDisplay();
    }

    function clearInput() {
        currentInput = '';
        previousInput = '';
        currentOperator = null;
        hasDecimal = false;
        updateDisplay();
    }

    function deleteLastDigit() {
        if (currentInput.length > 0) {
            if (currentInput.endsWith('.')) {
                hasDecimal = false;
            }
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay();
    }

    function toggleSign() {
        if (currentInput) {
            if (currentInput.startsWith('-')) {
                currentInput = currentInput.slice(1);
            } else {
                currentInput = '-' + currentInput;
            }
        }
        updateDisplay();
    }

    function handlePercent() {
        if (currentInput) {
            currentInput = (parseFloat(currentInput) / 100).toString();
            updateDisplay();
        }
    }

    // Event listeners for button clicks
    digitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = button.getAttribute('data-value');
            handleDigit(value);
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const operator = button.textContent;
            handleOperator(operator);
        });
    });

    equalsButton.addEventListener('click', calculate);
    clearButton.addEventListener('click', clearInput);
    toggleSignButton.addEventListener('click', toggleSign);
    percentButton.addEventListener('click', handlePercent);

    // Keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (!isNaN(key)) {
            handleDigit(key);
        } else if (key === '.') {
            handleDigit(key);
        } else if (key === 'Backspace') {
            deleteLastDigit();
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape') {
            clearInput();
        } else if (key === '+') {
            handleOperator('+');
        } else if (key === '-') {
            handleOperator('-');
        } else if (key === '*') {
            handleOperator('✕');
        } else if (key === '/') {
            handleOperator('÷');
        }
    });
});
