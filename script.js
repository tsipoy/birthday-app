const endpoint =
  "https://gist.githubusercontent.com/Pinois/e1c72b75917985dc77f5c808e876b67f/raw/b17e08696906abeaac8bc260f57738eaa3f6abb1/birthdayPeople.json";
const addButton = document.querySelector(".add-buttton");
let birthdayData = document.querySelector("div.main-content");
const select = document.querySelector(".select-by-month");
const input = document.querySelector('[name="filter"]');

async function fetchBirthday() {
  const response = await fetch(endpoint);
  let data = await response.json();

  async function destroyPopup(openPopup) {
    openPopup.classList.remove("open");
    openPopup.remove();
    openPopup = null;
  }

  const populateBirthday = (people) => {
    return people
      .map((person) => {
        const daySuffix = function (df) {
          if (df > 3 && df < 21) return "th";
          switch (df % 10) {
            case 1:
              return "st";
            case 2:
              return "nd";
            case 3:
              return "rd";
            default:
              return "th";
          }
        };

        let birthdayYear;
        const calculateAge = (age) => {
          const msDate = Date.now() - age.getTime();
          const ageDate = new Date(msDate);
          return Math.abs(ageDate.getFullYear() - 1970) + 1;
        };
        const year = calculateAge(new Date(person.birthday));
        
        // const currentDate = new Date();
        let date = new Date(person.birthday);
        
        let month = date.toLocaleString("default", { month: "long" });
        const birthDay = date.getDate();
        
        const today = new Date();
        const birthdayDate = new Date(person.birthday);

        // if(date.getMonth() <  currentDate.getMonth()) {
        //   birthdayYear = today.getFullYear() + 1;
        //   year++;
        // }

        if (today > birthdayDate) {
          birthdayDate.setFullYear(today.getFullYear() + 1);
        }

        const diff = Math.floor((birthdayDate - today) / (1000 * 60 * 60 * 24));

        return `
            <div data-id="${person.id}" class="birthday-lists">
              <img src="${person.picture}" alt="${
          person.firstName
        }" class="picture">
              <div class="name-birthday">
                <ul class="person-name">
                  <li class="lastname" data-value="${person.lastName}">${
          person.lastName
        } 
                  <li class="firstname" data-value="${person.firstName}">${
          person.firstName
        }</li>
                </ul>
                <div>
                  <span class="birthday">Turns <b>${year}</b> on ${month} ${birthDay}
                  <sup>${daySuffix(birthDay)}</sup> 
                  </span>
                </div>
              </div>
              <nav class="buttons-wrapper">
                <p class="leftDay">In ${diff} days<br></p>
                <ul class="icons-wrapper">
                  <li class="edit-btn">
                    <button class="edit" value="${person.id}">
                      <i class="ri-edit-box-fill icons-edit"></i> 
                    </button>
                  </li>
                  <li class="delete-btn">
                    <button class="delete" value="${person.id}">
                      <i class="ri-delete-bin-line icons-delete"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
        `;
      })
      .join("");
  };
  const generatedBirthday = () => {
    const html = populateBirthday(data);
    birthdayData.innerHTML = html;
  };
  generatedBirthday();

  let peopleData = [];
  const addPeople = (e) => {
    e.preventDefault();
    const el = e.target;
    const newPeople = {
      picture: el.picture.value,
      lastName: el.lastName.value,
      firstName: el.firstName.value,
      birthday: el.birthday.getDay(),
      id: Date.now(),
    };
    peopleData.push(newPeople);
    el.reset();
    birthdayData.dispatchEvent(new CustomEvent("updatedBirthday"));
  };

  const addEditPopup = (e) => {
    if (e.target.closest("button.add-buttton")) {
      editAddPopup(e);
    }
  };

  birthdayData.addEventListener("click", addEditPopup);

  // open add modal
  const editAddPopup = () => {
    const addFormPopup = document.createElement("form");
    addFormPopup.classList.add("popup");
    addFormPopup.classList.add("open");

    addFormPopup.insertAdjacentHTML(
      "afterbegin",
      `
            <fieldset> 
                <div class="form-group">
                    <label for="addLastname" class="lastname-label" >Lastname</label>
                    <input type="text" class="form-control" name="lastName" id="addLastname">
                </div>
                <div class="form-group">
                    <label for="addFirstname" class="firstname-label">Firstname</label>
                    <input type="text" class="form-control"  name="firstName" id="addFirstname" aria-describedby="firstnameHelp">
                </div>
                <div class="form-group">
                    <label for="addBirthday" class="birthday-label">Birthday</label>
                    <input type="date" class="form-control" name="birthday" id="addBirthday">
                </div>
                <div class="form-group">
                    <label for="addAvatar" class="avatar">Picture(Url)</label>
                    <input type="url" class="form-control" name="picture" id="addAvatar">
                </div>
                <div class="d-flex flex-row">
                    <button type="submit" class="submit-btn">Save</button>
                    <button class="close-btn" name="close" type="button">Close</button>
                </div>
            </fiedset>
        `
    );

    // submit form
    addFormPopup.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        const submitAddForm = e.target;
        // submitAddForm.lastName = addFormPopup.addLastname.value;
        // submitAddForm.firstName = addFormPopup.addFirstname.value;
        // //submitAddForm.birthday = addFormPopup.addBirthday.value;
        // submitAddForm.picture = addFormPopup.addAvatar.value;
        const newPeople = {
          picture: submitAddForm.picture.value,
          lastName: submitAddForm.lastName.value,
          firstName: submitAddForm.firstName.value,
          birthday: submitAddForm.birthday.value,
          id: Date.now(),
        };
        data.push(newPeople);
        generatedBirthday(data);
        destroyPopup(addFormPopup);
        updateLocalStorage();
      },
      { once: true }
    );

    // open form
    document.body.appendChild(addFormPopup);
    addFormPopup.classList.add("open");
    // close form
    if (addFormPopup.close) {
      const closeAddBtn = addFormPopup.close;
      closeAddBtn.addEventListener(
        "click",
        (e) => {
          destroyPopup(addFormPopup);
        },
        { once: true }
      );
    }
  };

  addButton.addEventListener("click", editAddPopup);

  // editting popup

  const popupBirthday = (e) => {
    if (e.target.closest("button.edit")) {
      const tableRow = e.target.closest("div");
      const id = tableRow.dataset.id;
      editPopup(id);
    }
  };

  // open modal
  const editPopup = (editId) => {
    const editIdPopup = data.find(
      (person) => person.id === editId || person.id == editId
    );
    return new Promise(async function (resolve) {
      const formPopup = document.createElement("form");
      formPopup.classList.add("popup");
      formPopup.classList.add("open");
      formPopup.insertAdjacentHTML(
        "afterbegin",
        `
                <fieldset> 
                    <h2>Edit ${editIdPopup.lastName} ${editIdPopup.firstName}</h2>
                    <div class="form-group">
                        <label class="label" for="lastname">Lastname</label>
                        <input type="text" class="form-control" id="lastnameId" value="${editIdPopup.lastName}">
                    </div>
                    <div class="form-group">
                        <label class="label" for="firstname">Firstname</label>
                        <input type="text" class="form-control" id="firstnameId" aria-describedby="firstnameHelp" value="${editIdPopup.firstName}">
                    </div>
                    <div class="form-group">
                        <label class="label" for="birthday">Birthday</label>
                        <input type="date" class="form-control" id="birthdayId" name="birthday-date">
                    </div>
                    <div class="form-group">
                        <label class="label" for="url">Your avatar image</label>
                        <input type="url" class="form-control" id="urlId" value="${editIdPopup.picture}">
                    </div>
                    <div class="d-flex flex-row">
                        <button type="submit" class="submitbtn" name="submit">Save change</button>
                        <button class="close-btn" name="close" type="button">Cancel</button>
                    </div>
                </fiedset>
            `
      );

      // submit form
      formPopup.addEventListener(
        "submit",
        (e) => {
          e.preventDefault();
          editIdPopup.lastName = formPopup.lastnameId.value;
          editIdPopup.firstName = formPopup.firstnameId.value;
          editIdPopup.birthday = formPopup.birthdayId.value;
          editIdPopup.picture = formPopup.urlId.value;
          generatedBirthday(editIdPopup);
          // resolve(e.target.displayList(editIdPopup));
          destroyPopup(formPopup);
          // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
          // updateLocalStorage();
        },
        { once: true }
      );

      // open form
      document.body.appendChild(formPopup);
      formPopup.classList.add("open");
      // await wait(50);
      // close form
      if (formPopup.close) {
        const closeBtn = formPopup.close;
        closeBtn.addEventListener(
          "click",
          (e) => {
            destroyPopup(formPopup);
          },
          { once: true }
        );
      }
    });
  };

  // Confirm delete
  const deletedPopup = (e) => {
    const deletedTr = e.target.closest("button.delete");
    if (deletedTr) {
      const tr = e.target.closest("div");
      const deletedFromId = tr.dataset.id;
      deletedData(deletedFromId);
    }
  };

  const deletedData = (deletedId) => {
    const deletePeople = data.find(
      (person) => person.id !== deletedId || person.id != deletedId
    );

    return new Promise(async function (resolve) {
      const openDiv = document.createElement("article");
      openDiv.classList.add("open");
      openDiv.insertAdjacentHTML(
        "afterbegin",
        `
                <article class="delete-confirm" data-id="${openDiv.id}">
                    <p>Are you sure you want to delete it!</p>
                    <button class="delete-button" name="deleteBtn" type="button" data-id="${openDiv.id}">Delete</button>
                    <button class="cancel-button cancel" name="cancel" type="button" data-id="${openDiv.id}">Cancel</button>
                </article>
            `
      );
      const confirmDelete = (e) => {
        const cancelBtn = e.target.closest("button.cancel-button");
        if (cancelBtn) {
          destroyPopup(openDiv);
        }
      };

      openDiv.addEventListener("click", () => {
        const deletePersonBirthday = data.filter(
          (person) => person.id != deletedId
        );
        const deleteConfirm = document.querySelector("button.delete-button");
        if (deleteConfirm) {
          data = deletePersonBirthday;
          generatedBirthday(data);
          destroyPopup(openDiv);
          // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
          updateLocalStorage();
        }
      });

      openDiv.addEventListener("click", confirmDelete);
      document.body.appendChild(openDiv);
      //await wait(20);
      openDiv.classList.add("popup");
    });
  };

  const initLocalStorage = () => {
    const stringForm = localStorage.getItem("data");
    const listItems = JSON.parse(stringForm);

    if (listItems) {
      peopleData = listItems;
    } else {
      peopleData = data;
    }
    generatedBirthday(peopleData);
    updateLocalStorage();
  };

  const updateLocalStorage = () => {
    localStorage.setItem("data", JSON.stringify(data));
  };

  // Filter input
  const searchInput = (e) => {
    const filterInput = input.value;
    const filterBirthday = data.filter((data) =>
      data.lastName.toLowerCase().includes(filterInput.toLowerCase())
    );
    const filterFromHtml = populateBirthday(filterBirthday);
    birthdayData.innerHTML = filterFromHtml;
    if (filterBirthday.length < 0) {
      console.log("Nobody matches that filter options.");
      birthdayData = `<p><i>Nobody matches that filter options.</p>`;
    }
  };

  select.addEventListener("change", function (e) {
    let filteredArr = data.filter((item) => {
      let date = new Date(item.birthday);
      let monthName = date.toLocaleString("default", { month: "long" });

      return monthName == e.target.value;
    });

    let month = populateBirthday(filteredArr);
    birthdayData.innerHTML = month;
  });

  input.addEventListener("input", searchInput);
  birthdayData.addEventListener("submit", addPeople);
  window.addEventListener("click", popupBirthday);
  window.addEventListener("click", deletedPopup);
  // birthdayData.addEventListener('updatedBirthday', updateLocalStorage);

  initLocalStorage();
}

fetchBirthday();
