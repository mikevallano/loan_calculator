let loanForm = document.getElementById('loan-form')
let amountInput = document.getElementById('amount')
let interestInput = document.getElementById('interest')
let yearsInput = document.getElementById('years')
let monthlyPaymentOutput = document.getElementById('monthly-payment')
let totalPaymentOutput = document.getElementById('total-payment')
let interestOutput = document.getElementById('total-interest')
let loader = document.getElementById('loading')
let resultsOutput = document.getElementById('results')


addEventListeners()


function addEventListeners(){
  document.addEventListener('DOMContentLoaded', function(){
  })
  loanForm.addEventListener('submit', function(e){
    e.preventDefault()
    resultsOutput.classList.add('d-none')
    checkValidForm()
    if (loanForm.checkValidity()) {
      let inputVals = getInputValues()
      let calcResults = calculateResults(inputVals)
      loader.classList.remove('d-none')
      setTimeout(function(){
        loader.classList.add('d-none')
        outputResults(calcResults)
      }, 1000)
    }
  })
}

function checkValidForm(e){
  if (loanForm.checkValidity() === false) {
    event.stopPropagation();
    loanForm.classList.add('was-validated')
  }
}

function getInputValues(){
  return { 'amount': parseInt(amountInput.value),
           'interest': parseFloat(interestInput.value),
           'years': parseInt(yearsInput.value)
          }
}

function calculateResults(obj){
  let returnObj = {}
  let principal = obj.amount
  let interest = obj.interest
  let years = obj.years

  let calculatedInterest = parseFloat(interest / 100 / 12)
  let calculatedPayments = parseFloat(years * 12)

  let x = Math.pow(1 + calculatedInterest, calculatedPayments)

  let monthlyPayment = (principal * x * calculatedInterest)/(x-1)
  let totalPayment = (monthlyPayment * calculatedPayments)
  let interestPayment = (totalPayment - principal)

  if ( isNaN(parseFloat(monthlyPayment)) || !isFinite(monthlyPayment) ) {
    returnObj.error = 'Error calculating data. Check numbers and try again.'
  } else {
    returnObj.monthlyPayment = monthlyPayment
    returnObj.totalPayment = totalPayment
    returnObj.interestPayment = interestPayment
  }

  return returnObj
}

function outputResults(obj){
  if (obj.error) {
    displayErrorMessage(obj.error)
  } else {
    resultsOutput.classList.remove('d-none')
    monthlyPaymentOutput.value = displayCurrency.format(obj.monthlyPayment)
    totalPaymentOutput.value = displayCurrency.format(obj.totalPayment)
    interestOutput.value = displayCurrency.format(obj.interestPayment)
  }
}

function displayErrorMessage(errorMsg){
  let errorDiv = document.createElement('div')
  errorDiv.classList = 'alert alert-danger'
  let errorText = document.createTextNode(errorMsg)
  errorDiv.appendChild(errorText)
  let card = document.querySelector('.card-body')
  let head = document.querySelector('.heading')
  card.insertBefore(errorDiv, head)

  setTimeout(clearError, 2500)
}

function clearError(){
  let errorDiv = document.querySelector('.alert-danger')
  errorDiv.remove()
}

const displayCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
