function toggleModal() {
  const modalElement = document.querySelector(".modal");
  modalElement.classList.toggle("hide");
}

function updateModal(modalButtonElement) {
  const action = modalButtonElement.dataset.action; //dataset
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

function handleDelete(event) {
  const id = event.target.dataset.dbId;
  fetch(`/tools?id=${id}`, { method: "DELETE" })
    .then(res => {
      if (res.ok) window.location.reload();
    })
    .catch(err => console.error("Error when delete: ", err));
}

function showDetail(itemData) {
  window.location.hash = itemData.rowid;
  console.log(itemData)
  Object.entries(itemData)
    .filter(keyValuePair => {
      console.log(keyValuePair);
      if (keyValuePair[0] !== "toolName" || keyValuePair[0] !== "RSSI")
        return true;
      return false;
    })
    .map(([key, value]) => {
      console.log(key);
      const editButtonElement = document.querySelector(
        '.modal-button[data-action="update"]'
      );
      isEditButtonElementHidden = editButtonElement.classList.contains("hide");
      if (isEditButtonElementHidden) {
        editButtonElement.classList.remove("hide");
      }
      const deleteButtonElement = document.querySelector(
        '.button-coral[data-action="delete"]'
      );
      isDeleteButtonElementHidden = deleteButtonElement.classList.contains(
        "hide"
      );
      if (isDeleteButtonElementHidden) {
        deleteButtonElement.classList.remove("hide");
      }

      const pingON = document.querySelector('.button-pingON[data-action="pingON"]');
      isPingONButtonHidden = pingON.classList.contains("hide");

      if (isPingONButtonHidden) {
        pingON.classList.remove("hide");
      }

      const pingOFF = document.querySelector('.button-pingOFF[data-action="pingOFF"]');
      isPingOFFButtonHidden = pingOFF.classList.contains("hide");

      if (isPingOFFButtonHidden) {
        pingOFF.classList.remove("hide");
      }


      const track = document.querySelector(
        '.button-track[data-action="track"]'
      );

      isTrackButtonHidden = track.classList.contains("hide");

      if (isTrackButtonHidden) {
        track.classList.remove("hide");
      }

      // if (key === "tagId") {
      //   track.dataset.tagId = value;
      //   return;
      // }

      if (key === "rowid") {
        const sectionToolDetailElement = document.querySelector("#tool-detail");
        sectionToolDetailElement.dataset.dbId = value;
        editButtonElement.dataset.dbId = value;
        deleteButtonElement.dataset.dbId = value;
        deleteButtonElement.addEventListener("click", handleDelete);
        pingON.dataset.dbId = value;
        pingON.addEventListener("click", turnpingON); 
        pingOFF.dataset.dbId = value;
        pingOFF.addEventListener("click", turnpingOFF); 
        track.dataset.dbId = value;
        track.addEventListener("click", handletrack); 
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
        button.dataset.dbId = data[i].rowid;

        button.addEventListener("click", function(event) {
          showDetail(data[i]);
        });

        listItem.append(button);
        list.append(listItem);
      }
      section.append(list);

      const toolId = decodeURI(window.location.hash).slice(1);
      const foundToolButtonElement = Array.from(
        document.querySelectorAll("#tool-list button")
      ).find(element => element.dataset.dbId === toolId);

      if (foundToolButtonElement) {
        foundToolButtonElement.click();
      }
    });
}
getTools();

// function sendCoordsToJarvas(x, y) {
//   fetch(`http://jarvas-api.herokuapp.com/location?x=${x}&y=${y}`, {
//     method: "POST"
//   })
//     .then(res => {
//       console.log(res.status);
//     })
//     .catch(err => {
//       console.error(
//         "something went wrong when sending coords to Jarvas: ",
//         err
//       );
//     });
// }

// function getRSSIfromdb(tagId) {
//   fetch(`/RSSI?tagId=${tagId}`)
//     .then(response => response.json())
//     .then(data => {
//       sendCoordsToJarvas(data.Xreading, data.Yreading);
//     })
//     .catch(err =>
//       console.error(
//         "something went wrong when getting RSSI coords. Error: ",
//         err
//       )
//     );
// }
// const pingButtonElement = document.querySelector("#ping");
// pingButtonElement.addEventListener("click", handlePing);

// function handlePing() {
//   console.log("pinging...")
//   fetch("http://172.20.10.9/LED=OFF", {
//     method: "POST"
//   })
//     .then(res => {
//       console.log("POSTED SUCCESSFULLY")
//       console.log(res.status);
//     })
//     .catch(err =>
//       console.error(
//         "something went wrong when pinging. Response is not 200. Error: ",
//         err
//       )
//     );
// }


// LED & BUZZER
function turnpingON() {
  console.log("pinging ON...")
  fetch("http://172.20.10.12/LED=ON", {
    method: "GET"
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

function turnpingOFF() {
  console.log("pinging OFF...")
  fetch("http://172.20.10.12/LED=OFF", {
    method: "GET"
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

// // TRACK BUTTONS
// function sendIpaddress(tagIP)
// {
//   console.log("posting...")
//   fetch(`http://${tagIP}/1`, {
//     method: "POST"
//   })
//   .then(res => {
//     console.log(res.status);
//   })
//   .catch(err =>
//     console.error(
//       "something went wrong when sending to IP ADDRESS. Response is not 200. Error: ",
//       err
//     )
//   );

// }

// function gettagIdfromtools(tagId)
// {
//   console.log("Retrieving Data From DataBase...")
//   fetch(`/tools?tagId=${tagId}`)
  
//     .then(response => response.json())
//     .then(data => {
//       sendIpaddress(data.tagId);
//       console.log(data.tagId)
//     })
//     .catch(err =>
//       console.error(
//         "something went wrong when getting RSSI coords. Error: ",
//         err  
//       )
//     );

// }

const trackButtonElement = document.querySelector("#track");
trackButtonElement.addEventListener("click", handletrack);


function handletrack() {
console.log("tracking...")
gettagIdfromtools();
window.open("https://tomas-tp-front.herokuapp.com/");
}

//   fetch("https://tomas-tp-front.herokuapp.com/", {
//     method: "POST"
//   })
//     .then(res => {
//       console.log(res.status);
//     })
//     .catch(err =>
//       console.error(
//         "something went wrong when pinging. Response is not 200. Error: ",
//         err
//       )
//     );
// }

function check(form) {
  /*function to check userid & password*/
  /*the following code checkes whether the entered userid and password are matching*/
  if (form.userid.value == "1" && form.pswrd.value == "1") {
    window.open("tools.html");
    window.close("login.html");
  } else {
    alert("Error Password or Username"); /*displays error message*/
  }
}

function back() {
  window.open("index.html");
  window.close("login.html");
}


