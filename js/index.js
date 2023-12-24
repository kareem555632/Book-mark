// ================> q-1 <==================>

// ========================================================== //
// ======================== Box Modal ======================= //
// Get elements for box model
let boxModel = document.querySelector(".box-info");
let closeBtn = document.getElementById("closeBtn");
//Close Model Function
function closeBoxModel() {
  boxModel.classList.add("d-none");
  removeInvalidClasses();
}
// Close model when close button is clicked
closeBtn.addEventListener("click", closeBoxModel);
// Close model when the Escape key is pressed
document.addEventListener("keydown", function (element) {
  if (element.key === "Escape") {
    closeBoxModel();
  }
});
// Close model when clicking outside the box model
document.addEventListener("click", function (element) {
  if (element.target.classList.contains("box-info")) {
    closeBoxModel();
  }
});
// ========================================================== //
// ========================= Set-Up ========================= //
// Get inputs & selected elements
let siteNameInput = document.getElementById("siteName");
let siteUrlInput = document.getElementById("siteUrl");
let siteCategory = document.getElementById("siteCategory");
let filterCategory = document.getElementById("filterCategory");

// Global variable for update index and delete index
let updateIndex = -1;
let deleteIndex = -1;

// Global variable for filter category
let filteredCategory;

// Get Add & Update buttons IDs
let addButton = document.getElementById("addBtn");
let updateButton = document.getElementById("updateBtn");

// Array to store site objects
let sitesList = [];
// Array to store filtered site objects
let filteredSites = [];

// Function to go-up when I click on any buuton in the table
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
// ========================================================== //
// ======================= Validation ======================= //
function addInvalidClass(element) {
  element.classList.add("is-invalid");
}

function removeInvalidClass(element) {
  element.classList.remove("is-invalid");
}

function addValidClass(element) {
  element.classList.add("is-valid");
}

function removeValidClass(element) {
  element.classList.remove("is-valid");
}
function removeValidClasses() {
  removeValidClass(siteNameInput);
  removeValidClass(siteUrlInput);
}

function addValidClasses() {
  addValidClass(siteNameInput);
  addValidClass(siteUrlInput);
}

function addInvalidClasses() {
  addInvalidClass(siteNameInput);
  addInvalidClass(siteUrlInput);
}

function removeInvalidClasses() {
  removeInvalidClass(siteNameInput);
  removeInvalidClass(siteUrlInput);
}

function isSiteNameExists(name) {
  let lowerCaseName = name.toLowerCase().trim();
  let exists = sitesList.some(
    (site) => site.name.toLowerCase() === lowerCaseName
  );
  return exists;
}

function isSiteURLExists(url) {
  let lowerCaseURL = url.toLowerCase().trim();
  let exists = sitesList.some(
    (site) => site.url.toLowerCase() === lowerCaseURL
  );
  return exists;
}

function hideMessage(messageElement) {
  messageElement.style.display = "none";
}

function showMessage(messageElement) {
  messageElement.style.display = "block";
}

function enableButtons() {
  addButton.disabled = false;
  updateButton.disabled = false;
}

function disableButtons() {
  addButton.disabled = true;
  updateButton.disabled = true;
}

let existNameMessage = document.getElementById("existName");
existNameMessage.style.display = "none";

function validationName() {
  if (!siteNameInput.value) {
    hideMessage(existNameMessage);
  }

  let regexName = /^[A-Za-z-\d\s]{4,20}$/;

  if (!regexName.test(siteNameInput.value)) {
    addInvalidClass(siteNameInput);
    if (!siteNameInput.value) {
      removeInvalidClass(siteNameInput);
      removeValidClass(siteNameInput);
    }
    return false;
  } else {
    // Check if the name already exists
    // Skip existence check during update
    if (!isUpdateMode() && isSiteNameExists(siteNameInput.value)) {
      addInvalidClass(siteNameInput);
      removeValidClass(siteNameInput);
      showMessage(existNameMessage);
      disableButtons();
      return false;
    }

    removeInvalidClass(siteNameInput);
    addValidClass(siteNameInput);
    hideMessage(existNameMessage);
    enableButtons();
    return true;
  }
}

let existURLMessage = document.getElementById("existURL");
existURLMessage.style.display = "none";

function validationURL() {
  if (!siteUrlInput.value) {
    hideMessage(existURLMessage);
  }

  let regexURL =
    /^(?:https?):\/\/(?:[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+)$/i;

  if (!regexURL.test(siteUrlInput.value)) {
    addInvalidClass(siteUrlInput);
    if (!siteUrlInput.value) {
      removeInvalidClass(siteUrlInput);
    }
    return false;
  } else {
    removeInvalidClass(siteUrlInput);
    addValidClass(siteUrlInput);

    // Check if the URL already exists
    // Skip existence check during update
    if (!isUpdateMode() && isSiteURLExists(siteUrlInput.value)) {
      addInvalidClass(siteUrlInput);
      removeValidClass(siteUrlInput);
      showMessage(existURLMessage);
      disableButtons();
      return false;
    }
    removeInvalidClass(siteUrlInput);
    addValidClass(siteUrlInput);
    hideMessage(existURLMessage);
    enableButtons();
    return true;
  }
}

// ========================================================== //
// ==================== Create Operation ==================== //
// Event listener for add button
addButton.onclick = function () {
  if (isValidInput()) {
    addSite();
  } else {
    showValidationError();
  }
};

function isValidInput() {
  return (
    validationName() &&
    validationURL() &&
    siteCategory.value !== "Select Category"
  );
}

function showValidationError() {
  boxModel.classList.remove("d-none");
  addInvalidClasses();
}

// Add site function
function addSite() {
  let siteObj = {
    name: siteNameInput.value,
    url: siteUrlInput.value,
    category: siteCategory.value,
  };

  sitesList.push(siteObj);
  localStorage.setItem("websites", JSON.stringify(sitesList));
  filterSitesByCategory(filteredCategory);

  clearForm();
}

// Clear input fields
function clearForm() {
  siteNameInput.value = "";
  siteUrlInput.value = "";
  siteCategory.value = "Select Category";
  filterCategory.value = filteredCategory;
  removeValidClasses();
}
// ========================================================== //
// =================== Display Operation ==================== //
// Check if there are stored websites in local storage
if (localStorage.getItem("websites") != null) {
  sitesList = JSON.parse(localStorage.getItem("websites"));
  filterSitesByCategory(filteredCategory);
}

// Display sites
function displaySites(list) {
  let tableBody = list
    .map(
      (site, index) => `
    <tr>
      <td>${index + 1}</td>
      <td class="text-capitalize">${site.name}</td>
      <td>${site.category}</td>
      <td>
        <button class="btn btn-success p-0" onclick="topFunction()">
          <a href="${
            site.url
          }" target="_blank" class="text-decoration-none text-light d-block">
            <i class="fa-solid fa-eye pe-2"></i>Visit
          </a>
        </button>
      </td>
      <td>
        <button class="btn btn-danger" onclick="deleteSite(${index})">
          <i class="fa-solid fa-trash-can pe-2"></i>Delete
        </button>
      </td>
      <td>
        <button class="btn btn-warning" onclick="setData(${index})">
          <i class="fa-solid fa-pen-to-square pe-2"></i>Update
        </button>
      </td>
    </tr>
  `
    )
    .join("");

  document.getElementById("tableBody").innerHTML = tableBody;
}

// ========================================================== //
// ==================== Filter Operation ==================== //
// Filter sites by category
function filterSitesByCategory(category = "1") {
  filteredCategory = category;
  switch (category) {
    case "1":
      displaySites(filterSitesByCategoryName("All"));
      break;
    case "2":
      displaySites(filterSitesByCategoryName("AI"));
      break;
    case "3":
      displaySites(filterSitesByCategoryName("CS"));
      break;
    case "4":
      displaySites(filterSitesByCategoryName("Front-End"));
      break;
    case "5":
      displaySites(filterSitesByCategoryName("English"));
      break;
    case "6":
      displaySites(filterSitesByCategoryName("Social Media"));
      break;
    case "7":
      displaySites(filterSitesByCategoryName("News"));
      break;
    case "8":
      displaySites(filterSitesByCategoryName("Series & Movies"));
      break;
    case "9":
      displaySites(filterSitesByCategoryName("Others"));
      break;
  }
}
function filterSitesByCategoryName(category) {
  if (category === "All") {
    filteredSites = sitesList.map((site, index) => ({
      ...site,
      originalIndex: index,
    }));
    return filteredSites;
  }
  filteredSites = sitesList
    .map((site, index) => ({ ...site, originalIndex: index }))
    .filter((site) => site.category === category);
  return filteredSites;
}
// ========================================================== //
// ==================== Delete Operation ==================== //
function deleteSite(index) {
  deleteIndex = filteredSites[index].originalIndex;
  sitesList.splice(deleteIndex, 1);
  updateLocalStorageAndDisplay();
  topFunction();
}

function updateLocalStorageAndDisplay() {
  localStorage.setItem("websites", JSON.stringify(sitesList));
  filterSitesByCategory(filteredCategory);
}

// ========================================================== //
// =================== Search Operation ===================== //
function search(term) {
  let searchArr = filteredSites.filter((site) =>
    site.name.toLowerCase().includes(term.toLowerCase())
  );

  displaySites(searchArr);

  if (searchArr.length === 0 && term === "") {
    filterSitesByCategory(filteredCategory);
  }
}

// ========================================================== //
// =================== update Operation ===================== //
updateButton.onclick = function () {
  if (isValidInput()) {
    updateData();
    removeValidClasses();
    updateIndex = -1;
  } else {
    showValidationError();
  }
};
function setData(index) {
  updateIndex = filteredSites[index].originalIndex;
  let currentSite = filteredSites[index];
  siteNameInput.value = currentSite.name;
  siteUrlInput.value = currentSite.url;
  siteCategory.value = currentSite.category;
  removeInvalidClasses();
  addValidClasses();
  updateButton.classList.remove("d-none");
  addButton.classList.add("d-none");
  topFunction();
}
function isUpdateMode() {
  return updateIndex !== -1;
}
function updateData() {
  let siteObj = {
    name: siteNameInput.value,
    url: siteUrlInput.value,
    category: siteCategory.value,
  };

  // Update the corresponding item in sitesList
  sitesList.splice(updateIndex, 1, siteObj);

  // Update localStorage
  localStorage.setItem("websites", JSON.stringify(sitesList));
  filterSitesByCategory(filteredCategory);

  // Clear the form and display the updated sites
  clearUpdateForm();

  // Hide the update button and show the add button
  updateButton.classList.add("d-none");
  addButton.classList.remove("d-none");
}
function clearUpdateForm() {
  siteNameInput.value = "";
  siteUrlInput.value = "";
  siteCategory.value = "Select Category";
  removeValidClasses();
}