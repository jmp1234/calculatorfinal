$(document).ready(startApp);
var inputArray = [];
var lastOperatorClicked = null;
var previousNum = null;
var equalsCheck = false; //checks if the equal sign is the last operator clicked


function startApp() {
  clickHandlers();
}


function clickHandlers() {
  $('.number button').on('click', numberInputed)
  $('button.operator').on('click', operatorInputed);
  $('.clear>button').on('click', clearResult);
  $('#decimal').on('click', inputDecimal);
}


function numberInputed() {
  if(isNaN(inputArray[inputArray.length-1]) && inputArray[inputArray.length-1] !== '.') {
    inputArray.push($(this).text());
    console.log('inputArray:', inputArray);
    $('.display-window').text($(this).text());
  } else {
      inputArray[inputArray.length-1] += $(this).text();
      $('.display-window').append($(this).text());
  }
  console.log('inputArray:', inputArray);
  previousNum = $(this).text();
}


function operatorInputed() {
  determineResult();

  if($(this).text() === '=') { //if the operator is an equal sign
    checkForRepeatOrRollover($(this));
    equalsCheck = true;
    checkForInfinity();
    checkForMissingOperands();
    missingOperationCheck()

  } else { //this covers the other operators
      testForMultipleOperations();
      inputArray.push($(this).text());
      checkForRepeatOrRollover($(this));
      lastOperatorClicked = $(this).text();
      equalsCheck = false;
      $('.display-window').text(inputArray[0]);
      prematureOperationCheck();
  }

  console.log('inputArray:', inputArray)
  console.log('previousnum:', previousNum);
  console.log('lastoperator:', lastOperatorClicked);
}


function doMath(num1, num2, operator) {
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);
  var result = null;
  switch(operator) {
    case '+':
      result = num1 + num2;
      break;
    case '-':
      result = num1 - num2;
      break;
    case 'x':
      result = num1 * num2;
        break;
    case '/':
      result = num1 / num2;
      break;
  }

  return result;
}


function inputDecimal() {
  var lastIndex = inputArray.length-1;
  if(inputArray.length >= 1 && inputArray[lastIndex].indexOf('.') > -1  ) {
    // return inputArray;
  } else if(isNaN(inputArray[lastIndex])) {
    inputArray.push($(this).text());
    $('.display-window').text('.')
  } else {
    inputArray[lastIndex] += '.';
    $('.display-window').append($(this).text());
  }

  console.log(inputArray);
}


function testForMultipleOperations() {
  if(isNaN(inputArray[inputArray.length-1])) {
    inputArray.pop();
  }
}


function clearResult() {
  inputArray = [];
  result = 0;
  console.log(inputArray);
  $('.display-window').text('');
  previousNum = null;
  lastOperatorClicked = null;
}


function determineResult() {
  if(inputArray.length === 3) {

    var result = doMath(inputArray[0],inputArray[2],inputArray[1]);
    console.log('result:', result);
    inputArray = [result];
  }
}


function getPreviousResults() {
   lastOperatorClicked = inputArray[inputArray.length-1];
   previousNum = inputArray[0];
}


function checkForRepeatOrRollover(operator) {

   if(equalsCheck === true && operator.text() === '=' && lastOperatorClicked !== null) { //checks if previous input is ==

     inputArray = [doMath(inputArray[0], previousNum, lastOperatorClicked)];

   } else if(operator.text() === '=' && inputArray.length === 2) { //checks if previous input is an operator
     console.log(inputArray.length)
     previousNum = inputArray[0]; //if this operation is followed by another equal sign, set previousNum to sum of previous digits
    inputArray = [doMath(inputArray[0], inputArray[0], lastOperatorClicked)];
  }
}


function checkForInfinity() {
  if(inputArray[0] === Infinity) {
    $('.display-window').text("Error")
  } else {
    $('.display-window').text(inputArray[0]);
  }
}


function prematureOperationCheck() {
  if(inputArray.length === 1) {
    inputArray.pop();
  }
}


function checkForMissingOperands() {
  if(inputArray.length === 0 || inputArray[0] === null) {
    $('.display-window').text('Ready');
    inputArray.pop();
  }
}


function missingOperationCheck() {
  if(inputArray.length === 1 && lastOperatorClicked === null && previousNum === null) {
    inputArray = [inputArray[0]];
  }
}
