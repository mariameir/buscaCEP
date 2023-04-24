
const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");
const fadeElement = document.querySelector("#fade");
const loaderElement = document.querySelector("#loader");
const messageElement = document.querySelector("#message");
const messageTextElement = document.querySelector("#message p");

// Add event listeners
cepInput.addEventListener("keypress", validateCEPInput);
cepInput.addEventListener("keyup", getAddress);

// Show or hide message modal
closeButton.addEventListener("click", toggleMessageModal);

// Save address
addressForm.addEventListener("submit", saveAddress);

// Validate CEP Input
function validateCEPInput(event) {
  const onlyNumbers = /[0-9]|\./;
  const key = String.fromCharCode(event.keyCode);

  if (!onlyNumbers.test(key)) {
    event.preventDefault();
  }
}

// Get address from API
async function getAddress(event) {
  const cep = event.target.value;

  if (cep.length !== 8) {
    return;
  }

  toggleLoader();

  try {
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Erro ao buscar endereço");
    }

    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP inválido");
    }

    fillAddressForm(data);
  } catch (error) {
    resetAddressForm();
    toggleMessageModal(error.message);
  } finally {
    toggleLoader();
  }
}

// Fill address form with data from API
function fillAddressForm(data) {
  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  enableAddressForm();
}

// Reset address form and disable it
function resetAddressForm() {
  addressForm.reset();
  disableAddressForm();
}

// Enable all inputs in address form
function enableAddressForm() {
  formInputs.forEach((input) => input.removeAttribute("disabled"));
}

// Disable all inputs in address form except CEP input
function disableAddressForm() {
  formInputs.forEach((input) => {
    if (input !== cepInput) {
      input.setAttribute("disabled", "disabled");
    }
  });
}

// Show or hide loader
function toggleLoader() {
  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
}

// Show or hide message modal
function toggleMessageModal(msg = "") {
  messageTextElement.innerText = msg;

  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
}

// Save address
function saveAddress(event) {
  event.preventDefault();

  toggleLoader();

  setTimeout(() => {
    toggleLoader();
    toggleMessageModal("Endereço salvo com sucesso!");

    resetAddressForm();
  }, 1000);
}