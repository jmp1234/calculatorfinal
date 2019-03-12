$(document).ready(startApp);
var inputArray = [];
var lastOperatorClicked = null;
var previousNum = null;
var equalsCheck = false; //checks if the equal sign is the last operator clicked


function startApp() {
  clickHandlers();
}


function clickHandlers() { //these functions are called based on what buttons are pressed
  $('.number button').on('click', numberInputed)
  $('button.operator').on('click', operatorInputed);
  $('.clear>button').on('click', clearEverything);
  $('.clear-entry>button').on('click', clearEntry)
  $('#decimal').on('click', inputDecimal);
  $('button').on('click', fitToScreen)
}

//FUNCTIONS FOR BUTTONS CLICKED:


function numberInputed() {
  if(isNaN(inputArray[inputArray.length-1]) && inputArray[inputArray.length-1] !== '.') {
    inputArray.push($(this).text());
    $('.display-window > p').append($(this).text());

  } else {
      inputArray[inputArray.length-1] += $(this).text();
      $('.display-window > p').append($(this).text());
  }
  previousNum = inputArray[inputArray.length-1];
}


function operatorInputed() {
  determineResult($(this)); //when an operator is inputed, the current values in the input array are calculated

  if($(this).text() === '=') { //if the operator is an equal sign
    $('.display-window > p').removeClass('newLine')
    checkForRepeatOrRollover($(this));
    equalsCheck = true;
    missingOperationCheck() //checks for missing operations
    $('.display-window > p').text(Math.round( 100000000 * inputArray[0]) / 100000000);
    checkForMissingOperands();
    checkForInfinity(); //changes value of infinity to error

  } else { //this covers the other operators
      testForMultipleOperations();
      inputArray.push($(this).text());
      checkForRepeatOrRollover($(this));
      lastOperatorClicked = $(this).text();
      equalsCheck = false;
      $('.display-window > p').append($(this).text());
      prematureOperationCheck();
  }
}

//MATH FUNCTIONS:

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


function determineResult(operator) { //determines the solution of the numbers/operators in the input array based on order of operations.
  var result = null;
  if(inputArray.length >= 3 ) { //if the numbers in the array are multiplied or divided, the solution in the input array is calcualted

    for(var input=0; input<inputArray.length-1; input++) {
      if(inputArray[input] === 'x' || inputArray[input] === '/') {
        result = doMath(inputArray[input-1],inputArray[input+1], inputArray[input]);
        inputArray.splice(input-1, 3, result);
        input = 0;
      }
    }
  }
  if(inputArray.length >= 5) {
    result = doMath(inputArray[0],inputArray[2], inputArray[1]);
    inputArray.splice(0,3,result)
  }


  if(inputArray.length === 3 && operator.text() === '=') { //computes the solution right away, since an equal sign was clicked
    for(var input=0; input<inputArray.length-1; input++) {
      if(isNaN(inputArray[input])) {
        result = doMath(inputArray[input-1],inputArray[input+1], inputArray[input]);
        inputArray.splice(input-1, 3, result);
        input = 0;
      }
    }
  }
}

//COMPREHENSIVE/ADVANCED OPERATION CHECKS:


function checkForRepeatOrRollover(operator) { //given an input of '==' or an equal sign following an operator, math is done on the current input array

   if(equalsCheck === true && operator.text() === '=' && lastOperatorClicked !== null) { //checks if previous input is an equal sign
     inputArray = [doMath(inputArray[0], previousNum, lastOperatorClicked)];

   } else if(operator.text() === '=') { //checks if previous input is an operator

     if(inputArray.length === 2) {
        previousNum = inputArray[0]; //if this operation is followed by another equal sign, set previousNum to sum of previous digits
        inputArray = [doMath(inputArray[0], inputArray[0], lastOperatorClicked)];

     } else if(inputArray.length === 4 && inputArray[1] !== inputArray[3]){
       previousNum === inputArray[2]
       var secondNum = doMath(inputArray[2], inputArray[2], lastOperatorClicked);
       inputArray = [doMath(inputArray[0],secondNum, inputArray[1])]

     } else if(inputArray.length === 4 && inputArray[1] === inputArray[3]) {
       previousNum = doMath(inputArray[0],inputArray[2],lastOperatorClicked)
       inputArray = [doMath(previousNum, previousNum, lastOperatorClicked)]
     }
  }
}


function inputDecimal() {
  var lastIndex = inputArray.length-1;
  if(inputArray.length >= 1 && inputArray[lastIndex].indexOf('.') > -1  ) {
    return true;
  } else if(isNaN(inputArray[lastIndex])) {
    inputArray.push($(this).text());
    $('.display-window > p').append($(this).text());
  } else {
    inputArray[lastIndex] += '.';
    $('.display-window > p').append($(this).text());
  }

}


function testForMultipleOperations() { //if there are multiple successive operations, the last one is chosen as the input value
  if(isNaN(inputArray[inputArray.length-1])) {
    inputArray.pop();
    $('.display-window > p').text($('.display-window > p').text().slice(0,-1))
  }
}



function checkForInfinity() { //changes an infinity value to error
  if(inputArray[0] === Infinity) {
    $('.display-window > p').text("Error");
    inputArray.pop();
  }
}


function prematureOperationCheck() {  //ignores all operators that are placed before the start of a number
  if(inputArray.length === 1) {
    inputArray.pop();
    $('.display-window > p').text(' ');
  }
}


function checkForMissingOperands() { // if multiple equal signs (e.g. ===) are placed before anything is inputed, 0 is displayed on the screen
  if(inputArray.length === 0 || inputArray[0] === null) {
    inputArray.pop();
    $('.display-window > p').text(0);
  }
}


function missingOperationCheck()  //if an equal sign is entered without entering an operator, the original number is displayed
  if(inputArray.length === 1 && lastOperatorClicked === null && previousNum === null) {
    inputArray = [inputArray[0]];
  }
}


//CLEAR BUTTONS

function clearEverything() {   //clears everything
  $('.display-window > p').removeClass('newLine')
  inputArray = [];
  $('.display-window > p').text('');
  previousNum = null;
  lastOperatorClicked = null;
}

function clearEntry() {  //clears the most recent number
  if(inputArray.length % 2 !== 0) {
    var displayText = $('.display-window > p').text();
    var lastNumber = inputArray[inputArray.length-1]
    $('.display-window > p').text(displayText.substring(0, displayText.length - lastNumber.length));
    inputArray.pop(lastNumber);
  }
}

//FIXES PROBLEM OF LARGE AMOUNT OF DIGITS INPUTED:

function fitToScreen() {
  if($('.display-window > p').height() > 65) {
    $('.display-window > p').addClass('newLine')
  }
}
