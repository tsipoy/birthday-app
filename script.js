const endpoint =
  "https://gist.githubusercontent.com/Pinois/e1c72b75917985dc77f5c808e876b67f/raw/b17e08696906abeaac8bc260f57738eaa3f6abb1/birthdayPeople.json";
const addButton = document.querySelector(".add-buttton");
let birthdayData = document.querySelector("div.main-content");
const select = document.querySelector('[name="select"]');
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
    const sortedPeople = people.sort(function (a, b) {
      function peopleBirthday(month, day) {
        let today = new Date(),
          currentYear = today.getFullYear(),
          next = new Date(currentYear, month - 1, day);
        today.setHours(0, 0, 0, 0);
        if (today > next) next.setFullYear(currentYear + 1);
        return Math.round((next - today) / 8.64e7);
      }
      let birthdayA = peopleBirthday(
        new Date(a.birthday).getMonth() + 1,
        new Date(a.birthday).getDate()
      );
      let birthdayB = peopleBirthday(
        new Date(b.birthday).getMonth() + 1,
        new Date(b.birthday).getDate()
      );
      return birthdayA - birthdayB;
    });

    return sortedPeople
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
        let year = calculateAge(new Date(person.birthday));
        let date = new Date(person.birthday);

        let month = date.toLocaleString("default", { month: "long" });
        const birthDay = date.getDate();

        const today = new Date();
        let birthDayYear;
        const birthdayDate = new Date(person.birthday);

        if (birthdayDate.getMonth() < today.getMonth()) {
          birthDayYear = today.getFullYear() + 1;
          year++;
        } else if (
          birthdayDate.getMonth() == today.getMonth() &&
          birthdayDate.getDate() > today.getDate()
        ) {
          birthDayYear = today.getFullYear();
          year = year;
        } else if (
          birthdayDate.getMonth() == today.getMonth() &&
          birthdayDate.getDate() < today.getDate()
        ) {
          birthDayYear = today.getFullYear() + 1;
          year++;
        } else {
          birthDayYear = today.getFullYear();
        }

        let oneDay = 1000 * 60 * 60 * 24;

        let birth = new Date(
          birthDayYear,
          birthdayDate.getMonth(),
          birthdayDate.getDate()
        );
        let diff = Math.ceil((birth.getTime() - today.getTime()) / oneDay);

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
                  <span class="birthday">Turns <b>${year}</b> on ${month} ${birthDay}<sup>${daySuffix(
          birthDay
        )}</sup> 
                  </span>
                </div>
              </div>
              <nav class="buttons-wrapper">
                <p class="leftDay">In ${diff} days<br></p>
                <ul class="icons-wrapper">
                  <li class="edit-btn">
                    <button class="edit" value="${person.id}">
                      <i class="ri-edit-box-line icons-edit"></i> 
                    </button>
                  </li>
                  <li class="delete-btn">
                    <button class="delete" value="${person.id}">
                      <i class="ri-delete-back-2-line icons-delete"></i>
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
    const formatDate = new Date().toISOString().slice(0, 10);

    addFormPopup.insertAdjacentHTML(
      "afterbegin",
      `
            <fieldset class="new-birthday"> 
            <button class="cross-btn" name="cross" type="button">
              <i class="ri-close-fill"></i>
            </button>
              <h2 class="add-title">New birthday</h2>
                <div class="form-group">
                    <label for="addLastname" class="lastname-label">Lastname</label>
                    <input type="text" class="form-control" placeholder="Your lastname" name="lastName" id="addLastname">
                </div>
                <div class="form-group">
                    <label for="addFirstname" class="firstname-label">Firstname</label>
                    <input type="text" class="form-control" placeholder="Your firstname"  name="firstName" id="addFirstname" aria-describedby="firstnameHelp">
                </div>
                <div class="form-group">
                    <label for="addBirthday" class="birthday-label">Birthday</label>
                    <input type="date" class="form-control" name="birthday" id="addBirthday" max="${formatDate}">
                </div>
                <div class="form-group">
                    <label for="addAvatar" class="avatar">Picture(Url)</label>
                    <input type="url" class="form-control" placeholder="Your picture url" name="picture" id="addAvatar">
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
        document.body.style.overflow = "auto";
      },
      { once: true }
    );

    // open form
    document.body.appendChild(addFormPopup);
    addFormPopup.classList.add("open");
    document.body.style.overflow = "hidden";
    // close form
    if (addFormPopup.close) {
      const closeAddBtn = addFormPopup.close;
      const crossBtn = addFormPopup.cross;
      closeAddBtn.addEventListener(
        "click",
        (e) => {
          destroyPopup(addFormPopup);
          document.body.style.overflow = "auto";
        },
        { once: true }
      );
      crossBtn.addEventListener(
        "click",
        (e) => {
          destroyPopup(addFormPopup);
          document.body.style.overflow = "auto";
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
      const date = new Date(editIdPopup.birthday).toISOString().slice(0, 10);
      const formatDate = new Date().toISOString().slice(0, 10);

      const formPopup = document.createElement("form");
      formPopup.classList.add("popup");
      formPopup.classList.add("open");
      formPopup.insertAdjacentHTML(
        "afterbegin",
        `
                <fieldset class="edit-people-birthday"> 
                    <button class="cross-btn" name="cross" type="button">
                      <i class="ri-close-fill"></i>
                    </button>
                    <h2 class="edit-title">Edit ${editIdPopup.lastName} ${editIdPopup.firstName}</h2>
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
                        <input type="date" class="form-control" id="birthdayId" name="birthday-date" value="${date}" max="${formatDate}">
                    </div>
                    <div class="d-flex flex-row">
                        <button type="submit" class="submitbtn" name="submit">Save changes</button>
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
          generatedBirthday(editIdPopup);
          // resolve(e.target.displayList(editIdPopup));
          destroyPopup(formPopup);
          document.body.style.overflow = "auto";
          // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
          // updateLocalStorage();
        },
        { once: true }
      );

      // open form
      document.body.appendChild(formPopup);
      formPopup.classList.add("open");
      document.body.style.overflow = "hidden";
      // await wait(50);
      // close form
      if (formPopup.close) {
        const closeBtn = formPopup.close;
        const crossBtn = formPopup.cross;
        closeBtn.addEventListener(
          "click",
          (e) => {
            destroyPopup(formPopup);
            document.body.style.overflow = "auto";
          },
          { once: true }
        );
        crossBtn.addEventListener(
          "click",
          (e) => {
            destroyPopup(formPopup);
            document.body.style.overflow = "auto";
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
    data.find((person) => person.id !== deletedId || person.id != deletedId);

    return new Promise(async function (resolve) {
      const openDiv = document.createElement("article");
      openDiv.classList.add("open");
      document.body.style.overflow = "hidden";
      openDiv.insertAdjacentHTML(
        "afterbegin",
        `
          <article class="delete-confirm" data-id="${openDiv.id}">
            <button class="cross-btn" name="cross" type="button">
              <i class="ri-close-fill"></i>
            </button>
            <h2>Are you sure you want to delete it!</h2>
            <div>
              <button class="delete-button deleteBtn" name="deleteBtn" type="button" data-id="${openDiv.id}">Delete</button>
              <button class="cancel-button cancel" name="cancel" type="button" data-id="${openDiv.id}">Cancel</button>
            </div>
          </article>
        `
      );

      openDiv.addEventListener("click", (e) => {
        const deleteConfirm = e.target.closest("button.delete-button");
        const cancelDelete = e.target.closest("button.cancel-button.cancel");
        const crossDelete = e.target.closest(".cross-btn");
        openDiv.classList.add("open");
        if (deleteConfirm) {
          const deletePersonBirthday = data.filter(
            (person) => person.id != deletedId
          );
          data = deletePersonBirthday;
          generatedBirthday(data);
          destroyPopup(openDiv);
          birthdayData.dispatchEvent(new CustomEvent("updatedBirthday"));
          updateLocalStorage();
          document.body.style.overflow = "auto";
        }

        if (cancelDelete) {
          destroyPopup(openDiv);
          document.body.style.overflow = "auto";
        }

        if (crossDelete) {
          destroyPopup(openDiv);
          document.body.style.overflow = "auto";
        }
      });

      // openDiv.addEventListener("click", confirmDelete);
      document.body.appendChild(openDiv);
      //await wait(20);
      openDiv.classList.add("popup");
      document.body.style.overflow = "hidden";
    });
  };

  const initLocalStorage = () => {
    const stringForm = localStorage.getItem("data");
    const listItems = JSON.parse(stringForm);
    if (listItems) {
      peopleData = data = listItems;
    } else {
      peopleData = data;
    }
    generatedBirthday(peopleData);
    updateLocalStorage();
  };

  const updateLocalStorage = () => {
    localStorage.setItem("data", JSON.stringify(data));
  };

  function filters() {
    const filteredByMonth = select.value.toLowerCase().trim();
    const filteredByName = input.value.toLowerCase().trim();
    const searchingByName = data.filter((item) => {
      return (
        item.firstName.toLowerCase().includes(filteredByName) ||
        item.lastName.toLowerCase().includes(filteredByName)
      );
    });

    const searchingPeopleByNameAndMonth =
      filteredByMonth !== "empty"
        ? searchingByName.filter((item) => {
            let date = new Date(item.birthday);
            let monthName = date.toLocaleString("default", { month: "long" });
            return monthName.toLowerCase().includes(filteredByMonth);
          })
        : searchingByName;
    let filtering = populateBirthday(searchingPeopleByNameAndMonth);
    birthdayData.innerHTML = filtering;
  }

  input.addEventListener("keyup", filters);
  select.addEventListener("change", filters);
  birthdayData.addEventListener("submit", addPeople);
  window.addEventListener("click", popupBirthday);
  window.addEventListener("click", deletedPopup);
  birthdayData.addEventListener("updatedBirthday", updateLocalStorage);

  initLocalStorage();
}

fetchBirthday();
