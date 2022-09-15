
const form = document.forms[0]; // targeting form
const input = form.elements[0]; // targeting input control 
const error = document.getElementById('error'); // reference to error id

const valid = document.getElementById('valid'); // valid state;
form.addEventListener('submit', validateForm,false); // what to do after submit button is  click

function validateForm (e) {
    e.stopPropagation();
    // prevent form from submitting to server
    e.preventDefault();
    // obtaining email from form
    const email = form.email.value;
    // validating the form
    const searchPatter = /^\w+\d*?@\w+\.\w{2,}$/; //search pattern
    // checking for 
    if(searchPatter.test(email) === true) {
        valid.style.display = 'block';
        error.style.display = 'none';
    } else {
        error.style.display = 'block';
        valid.style.display = 'none';
    }
}


input.addEventListener('focus',() => {
        if(error.style.display === 'block') {
            error.style.display = 'none';
        } {
            valid.style.display = 'none';
        }
    }, false);