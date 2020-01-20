console.log(window.location);

function toggleModal() {
  const modalElement = document.querySelector(".modal");
  modalElement.classList.toggle("hide");
}

function updateModal(modalButtonElement) {
  const action = modalButtonElement.dataset.action;
  const dbId = modalButtonElement.dataset.dbId;

  const modalSubmitInputElement = document.querySelector(".modal-form-submit");
  const modalFormElement = document.querySelector(".modal-form");
  const toolDetailDisplayedValues = Array.from(
    document.querySelectorAll(".tool-detail-item p")
  ).map(function(pElement) {
    //.map -> go through every thing inside query and put function inside
    return pElement.textContent;
  });
  const modalFormInputElements = document.querySelectorAll(".modal-form-input");

  modalSubmitInputElement.value = action === "update" ? "Update" : "Create";
  // modalFormElement.setAttribute("method", action === "update" ? "PUT" : "POST"); //changes to PUT
  modalFormElement.setAttribute(
    "action",
    action === "update" ? `/tools?_method=PUT&id=${dbId}` : "/tools"
  );
  modalFormInputElements.forEach((inputElement, index) => {
    inputElement.value =
      action === "update" ? toolDetailDisplayedValues[index] : "";
  });
}

function handleModal(event) {
  updateModal(event.target);
  toggleModal();
}

document.querySelectorAll(".modal-button").forEach(function(element) {
  element.addEventListener("click", handleModal);
});
document.querySelector(".modal-close").addEventListener("click", handleModal);

function showDetail(itemData) {
  Object.entries(itemData)
    .filter(keyValuePair => keyValuePair[0] !== "toolName")
    .map(([key, value]) => {
      const editButtonElement = document.querySelector(
        '.modal-button[data-action="update"]'
      );
      isEditButtonElementHidden = editButtonElement.classList.contains("hide");
      if (isEditButtonElementHidden) {
        editButtonElement.classList.remove("hide");
      }

      if (key === "rowid") {
        const sectionToolDetailElement = document.querySelector("#tool-detail");
        sectionToolDetailElement.dataset.dbId = value;
        editButtonElement.dataset.dbId = value;
        return;
      }

      const elementToAppend = document.querySelector(`#${key}-js`); //backticks
      elementToAppend.textContent = value;

      const parentElementToAppend = elementToAppend.parentElement; //apend stuff to the bottom
      const labelElement = parentElementToAppend.querySelector("h4");
      const isLabelElementHidden = labelElement.classList.contains("hide");

      if (isLabelElementHidden) {
        labelElement.classList.remove("hide");
      }
    });
}

function getTools() {
  // GET request to /tools on server
  fetch("/tools")
    .then(response => response.json())
    .then(data => {
      const list = document.createElement("ul"); // this creates <ul></ul>

      const section = document.querySelector("#tool-list"); //this finds the elemt with id of #tool-list

      //loop through list to enter all the toolNames into button
      // create ul li and button structure
      for (let i = 0; i < data.length; i++) {
        const listItem = document.createElement("li"); // this creates <li></li>
        const button = document.createElement("button"); // this creates <button></button>
        button.textContent = data[i].name;

        button.addEventListener("click", function(event) {
          showDetail(data[i]);
        });

        listItem.append(button);
        list.append(listItem);
      }
      section.append(list);
    });
}
getTools();

function handlePing() {
  fetch("http://jarvas-api.herokuapp.com/location?x=3&y=4", {
    method: "POST"
  })
    .then(res => {
      console.log(res.status);
    })
    .catch(err =>
      console.error(
        "something went wrong when pinging. Response is not 200. Error: ",
        err
      )
    );
}

const pingButtonElement = document.querySelector("#ping");
pingButtonElement.addEventListener("click", handlePing);
