// All variables and functions for index.html, the Random Password Generator

// four character set strings
var specialChars = "!#$%&'()*+,-./:;<=>?@[]^_`{|}~";
// numericChars is tripled because of statistical underrepresentation during random selection
// helps to reduce invalid password returns from randomizer
var numericChars = "012345678901234567890123456789";
var lowerChars = "abcdefghijklmnopqrstuvwxyz";
var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// governor runs the show
function governor(length, special, numeric, lower, upper) {
  // console.log(length, special, numeric, lower, upper);
  var validLength = lengthChecker();
  // console.log(validLength);
  var validCheck = checkboxChecker();
  // console.log(validCheck);
  if (validLength) {
    if (validCheck) {
      var criteria = objectMaker(length, special, numeric, lower, upper);
      var password = generator(criteria);
      // console.log(password);
      document.getElementById("passwordDisplay").value = password;
      return password;
    }
    else (alert("At lease one character set must be selected!"));
  }
  else (alert("Password length must be between 8 - 128 characters!"));
}

// copy to clipboard function
function clipboardCopy() {
  var textArea = document.getElementById("passwordDisplay")
  var password = textArea.value;
  // console.log(password);
  textArea.select();
  textArea.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied your password: " + password);
}

// checks for valid input length
function lengthChecker() {
  var valid = false;
  var length = document.getElementById('passwordLengthInput').value;
  if (length >= 8 && length <= 128) {
    valid = true;
  }
  return valid;
}

// checks for at least one checked checkbox
function checkboxChecker() {
  var checked = false;
  if (document.getElementById("specialCharactersCheck").checked === true) {
    checked = true;
  }
  else if (document.getElementById("numericCharactersCheck").checked === true) {
    checked = true;
  }
  else if (document.getElementById("lowercaseLettersCheck").checked === true) {
    checked = true;
  }
  else if (document.getElementById("uppercaseLettersCheck").checked === true) {
    checked = true;
  }
  return checked;
}

// resets the modal form to default empty values when closed
function clearForm() {
  document.getElementById('passwordLengthInput').value = null;
  document.getElementById("specialCharactersCheck").checked = false;
  document.getElementById("numericCharactersCheck").checked = false;
  document.getElementById("lowercaseLettersCheck").checked = false;
  document.getElementById("uppercaseLettersCheck").checked = false;
  document.getElementById("passwordDisplay").value = null;
}

// object maker function
function objectMaker(length, special, numeric, lower, upper) {
  var criteria = {
    length: length,
    special: special,
    numeric: numeric,
    lower: lower,
    upper: upper,
  }
  return criteria;
}

// generator function
function generator(criteriaObject) {
  // will generate array from criteriaObject
  var criteriaArray = arrayMaker(criteriaObject);
  // will call stringMaker
  var charList = stringMaker(criteriaArray);
  // will call randomizer
  var password = randomizer(criteriaArray, charList);
  // !!! if "invalid password" call randomizer again !!!!
  while (password === "invalid") {
    // console.log("invalid password encountered");
    password = randomizer(criteriaArray, charList);
  }
  // will return password
  return password;
}

// arrayMaker function
function arrayMaker(criteriaObject) {
  var criteriaArray = [criteriaObject.length, criteriaObject.special,
  criteriaObject.numeric, criteriaObject.lower, criteriaObject.upper];
  return criteriaArray;
}

// stringMaker function
function stringMaker(arr) {
  var charList = "";
  for (var i = 1; i < arr.length; i++) {
    if (arr[i]) {
      if (i === 1) {
        charList = charList.concat(specialChars);
      }
      else if (i === 2) {
        charList = charList.concat(numericChars);
      }
      else if (i === 3) {
        charList = charList.concat(lowerChars);
      }
      else if (i === 4) {
        charList = charList.concat(upperChars);
      }
    }
  }
  return charList;
}

// randomizer function
function randomizer(arr, charList) {
  var password = "";
  for (var i = 0; i < arr[0]; i++) {
    var nextChar = charList.charAt(Math.floor(charList.length * Math.random()));
    password = password.concat(nextChar);
  }
  password = validator(arr, password, charList);
  return password;
}

// validator function
// could this be more DRY? !!!!!
// tricky little function
// takes in the array of user inputs created by generator function
// and the generated password from randomizer
// and validates that it contains a character from each eligible
// character list. if valid, it returns the input password,
// if invalid, it returns string "invalid password", which will
// trigger a restart of the process in a different function
function validator(arr, password, charList) {
  var valid = true;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i]) {
      if (i === 1) {
        valid = contains(password, specialChars);
        if (!valid) {
          i = arr.length;
        }
      }
      else if (i === 2) {
        valid = contains(password, numericChars);
        if (!valid) {
          i = arr.length;
        }
      }
      else if (i === 3) {
        valid = contains(password, lowerChars);
        if (!valid) {
          i = arr.length;
        }
      }
      else if (i === 4) {
        valid = contains(password, upperChars);
        if (!valid) {
          i = arr.length;
        }
      }
    }
  }
  if (valid) {
    return password;
  }
  else {
    var invalid = "invalid";
    return invalid;
  }
}

// contains function
// checks to make sure password string (password) includes at least 
// 1 character from character set (charString), returns boolean (valid)
function contains(password, charString) {
  var valid = false;
  for (var i = 0; i < charString.length; i++) {
    valid = password.includes(charString.charAt(i));
    if (valid) {
      i = charString.length;
    }
  }
  return valid;
}