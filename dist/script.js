console.log("It works");

const endpoint = "./people.json";
const addButton = document.querySelector(".add-buttton")
const birthdayData = document.querySelector("tbody");
const select = document.querySelector('.select-by-month');
const input = document.querySelector('[name="filter"]');

async function fetchBirthday() {

    const response = await fetch(endpoint);
    let data = await response.json();

    // loclal storage
    // localStorage.setItem("people", JSON.stringify(data));
    // var item = JSON.parse(localStorage.getItem("people"));

    async function destroyPopup(openPopup) {
        openPopup.classList.remove('open');
        openPopup.remove();
        openPopup = null;
    }

    const populateBirthday = people => {
        return people.map(person => {
            const daySuffix = function (df) {
                if (df > 3 && df < 21) return "th";
                switch (df % 10) {
                    case 1: return "st";
                    case 2: return "nd";
                    case 3: return "rd";
                    default: return "th";
                }
            }

            const calculateAge = (age) => {
                const msDate = Date.now() - age.getTime();
                const ageDate = new Date(msDate);
                return Math.abs(ageDate.getFullYear() - 1970) + 1;
            }
            const year = calculateAge(new Date(person.birthday));

            let date = new Date(person.birthday);
            let month = date.toLocaleString('default', { month: 'long' });
            const birthDay = date.getDate();

            // const dateDiffInDays = function(date1, date2) {
            //     dt1 = new Date(date1);
            //     dt2 = new Date(date2);
            //     return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
            // }
            // const totalDays = dateDiffInDays(new Date(person.birthDays));

            // const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            // const firstDate = new Date(date.getDate());
            // const secondDate = new Date();

            // const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

            // const firstDate = new Date(person.birthday);
            // const secondDate = new Date();

            // const difference = firstDate.getTime() - secondDate.getTime();

            // var diffDays = Math.ceil(difference / (1000 * 3600 * 24));

            function diff_days(dt2, dt1) {

                let diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                return Math.abs(Math.round(diff));

            }

            dt1 = new Date();
            dt2 = new Date(person.birthday);
            let diffDays = (diff_days(dt1, dt2));

            return `
                <tr data-id="${person.id}" class="table-row">
                    <td class="picture"><img src="${person.picture}" alt="${person.firstName}"></td>
                    <td class="lastname" data-value="${person.lastName}">${person.lastName}</td>
                    <td class="firstname" data-value="${person.firstName}">${person.firstName}</td>
                    <td class="birthday">Turns ${year} on the ${birthDay}<sup>${daySuffix(birthDay)}</sup> of ${month}</td>
                    <td class="leftDay">Days ${diffDays}<br></td>
                    <td class="edit-btn">
                        <button class="edit" value="${person.id}">
                            <img class="edit" src="./images/edit_icon.png" alt="${person.firstName}"> 
                        </button>
                    </td>
                    <td class="delete-btn">
                        <button class="delete" value="${person.id}">
                            <img class="delete" src="./images/delete_icon.png" alt="${person.firstName}">  
                        </button>
                    </td>
                </tr>
        `;
        }).join('')
    };
    const generatedBirthday = () => {
        const html = populateBirthday(data);
        birthdayData.innerHTML = html;
    }
    generatedBirthday();


    let peopleData = [];
    const addPeople = e => {
        e.preventDefault();
        console.log(e);
        const el = e.target;
        const newPeople = {
            picture: el.picture.value,
            lastName: el.lastName.value,
            firstName: el.firstName.value,
            birthday: el.birthday.getDay(),
            id: Date.now(),
        };
        peopleData.push(newPeople);
        console.log(newPeople);
        el.reset();
        birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
    }

    const addEditPopup = (e) => {
        if (e.target.closest('button.add-buttton')) {
            console.log("It opens");
            editAddPopup(e);
        }
    }

    birthdayData.addEventListener('click', addEditPopup);

    // open add modal 
    const editAddPopup = () => {
        const addFormPopup = document.createElement('form');
        addFormPopup.classList.add('popup');
        addFormPopup.classList.add('open');

        addFormPopup.insertAdjacentHTML('afterbegin',
            `
        <fieldset> 
            <div class="form-group">
                <label for="addLastname" class="lastname-label" value="${addFormPopup.firstName}">Lastname</label>
                <input type="text" class="form-control" id="addLastname">
            </div>
            <div class="form-group">
                <label for="addFirstname" class="firstname-label" value="${addFormPopup.lastName}">Firstname</label>
                <input type="text" class="form-control"  id="addFirstname" aria-describedby="firstnameHelp">
            </div>
            <div class="form-group">
                <label for="addBirthday" class="birthday-label">Birthday</label>
                <input type="date" class="form-control" id="addBirthday">
            </div>
            <div class="form-group">
                <label for="addAvatar" class="avatar" value="${addFormPopup.picture}">Picture(Url)</label>
                <input type="url" class="form-control" id="addAvatar">
            </div>
            <div class="d-flex flex-row">
                <button type="submit" class="submit-btn">Save</button>
                <button class="close-btn" name="close" type="button">Close</button>
            </div>
        </fiedset>
        `)

        // submit form 
        addFormPopup.addEventListener('submit', e => {
            e.preventDefault();
            const submitAddForm = e.target;
            submitAddForm.lastName = addFormPopup.addLastname.value;
            submitAddForm.firstName = addFormPopup.addFirstname.value;
            //submitAddForm.birthday = addFormPopup.addBirthday.value;
            submitAddForm.picture = addFormPopup.addAvatar.value;
            const newPeople = {
                picture: submitAddForm.picture,
                lastName: submitAddForm.lastName,
                firstName: submitAddForm.firstName,
                // birthday: submitAddForm.birthday,
                id: Date.now(),
            };
            data.push(newPeople);
            console.log(data);
            generatedBirthday(newPeople);
            destroyPopup(addFormPopup);
            updateLocalStorage();

            // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));

        }, { once: true });

        // open form
        document.body.appendChild(addFormPopup);
        addFormPopup.classList.add('open');
        // close form
        if (addFormPopup.close) {
            const closeAddBtn = addFormPopup.close;
            closeAddBtn.addEventListener('click', (e) => {
                destroyPopup(addFormPopup);
                console.log('It is canceled');
            }, { once: true });
        }
    };

    addButton.addEventListener("click", editAddPopup);

    // editting popup

    const popupBirthday = e => {
        if (e.target.closest('button.edit')) {
            const tableRow = e.target.closest('tr');
            console.log(tableRow);
            const id = tableRow.dataset.id;

            editPopup(id);
        }
    }


    // open modal 
    const editPopup = editId => {
        const editIdPopup = data.find(person => person.id === editId || person.id == editId);
        return new Promise(async function (resolve) {
            const formPopup = document.createElement('form');
            formPopup.classList.add('popup');
            formPopup.classList.add('open');
            console.log(editIdPopup.lastName);
            formPopup.insertAdjacentHTML('afterbegin',
                `
                <fieldset> 
                        <div class="form-group">
                            <label for="lastname">Lastname</label>
                            <input type="text" class="form-control" id="lastnameId" value="${editIdPopup.lastName}">
                        </div>
                        <div class="form-group">
                            <label for="firstname">Firstname</label>
                            <input type="text" class="form-control" id="firstnameId" aria-describedby="firstnameHelp" value="${editIdPopup.firstName}">
                        </div>
                        <div class="form-group">
                            <label for="birthday">Birthday</label>
                            <input type="date" class="form-control" id="birthdayId" name="birthday-date">
                        </div>
                        <div class="form-group">
                            <label for="url">Your avatar image</label>
                            <input type="url" class="form-control" id="urlId" value="${editIdPopup.picture}">
                        </div>
                        <div class="d-flex flex-row">
                            <button type="submit" class="submitbtn" name="submit">Submit</button>
                            <button class="close-btn" name="close" type="button">Close</button>
                        </div>
            
                </fiedset>
            `)


            // submit form 
            formPopup.addEventListener('submit', e => {
                e.preventDefault();
                console.log(e.target);
                editIdPopup.lastName = formPopup.lastnameId.value;
                editIdPopup.firstName = formPopup.firstnameId.value;
                editIdPopup.birthday = formPopup.birthdayId.value;
                editIdPopup.picture = formPopup.urlId.value;
                generatedBirthday(editIdPopup);
                // resolve(e.target.displayList(editIdPopup));
                destroyPopup(formPopup);
                // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
                updateLocalStorage();


            }, { once: true });

            // open form
            document.body.appendChild(formPopup);
            formPopup.classList.add('open');
            // await wait(50);
            // close form
            if (formPopup.close) {
                const closeBtn = formPopup.close;
                closeBtn.addEventListener('click', (e) => {
                    destroyPopup(formPopup);
                    console.log('It is canceled');
                }, { once: true });
            }
        },
        )
    };

    // Confirm delete
    const deletedPopup = (e) => {
        const deletedTr = e.target.closest('button.delete')
        if (deletedTr) {
            const tr = e.target.closest('tr');
            const deletedFromId = tr.dataset.id;
            deletedData(deletedFromId);

        }
    }

    const deletedData = deletedId => {
        const deletePeople = data.find(person => person.id !== deletedId || person.id != deletedId);

        console.log(data);
        return new Promise(async function (resolve) {
            const openDiv = document.createElement('article');
            openDiv.classList.add('open');
            openDiv.insertAdjacentHTML('afterbegin',
                `
                <article class="delete-confirm" data-id="${openDiv.id}">
                    <p>Are you sure you want to delete it!</p>
                    <button class="delete-button" name="deleteBtn" type="button" data-id="${openDiv.id}">Delete</button>
                    <button class="cancel-button cancel" name="cancel" type="button" data-id="${openDiv.id}">Cancel</button>
                </article>
            `
            );
            const confirmDelete = (e) => {
                const cancelBtn = e.target.closest('button.cancel-button');
                if (cancelBtn) {
                    console.log("You cancel it");
                    destroyPopup(openDiv);
                }
            }

            openDiv.addEventListener('click', () => {
                const deletePersonBirthday = data.filter(person => person.id != deletedId);
                const deleteConfirm = document.querySelector("button.delete-button");
                if (deleteConfirm) {
                    data = deletePersonBirthday;
                    generatedBirthday(data);
                    destroyPopup(openDiv);
                    console.log("You delete it");
                    // birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
                    updateLocalStorage();

                }
            });

            openDiv.addEventListener('click', confirmDelete);
            document.body.appendChild(openDiv);
            //await wait(20);
            openDiv.classList.add('popup');
        })
    }

    console.log(data)
    const initLocalStorage = () => { 
        const stringForm = localStorage.getItem('data');
        const listItems = JSON.parse(stringForm);

        if (listItems) {
            peopleData = listItems;
            console.log(peopleData)
        } else {
            peopleData = data;
        }
        generatedBirthday(peopleData);
            updateLocalStorage();
    }

    const updateLocalStorage = () => {
        localStorage.setItem('data', JSON.stringify(data));
    };

    // Filter input
    const searchInput = (e) => {
        const filterInput = input.value;
        console.log(filterInput);
        const filterBirthday = data.filter(data => data.lastName.toLowerCase().includes(filterInput.toLowerCase()));
        const filterFromHtml = populateBirthday(filterBirthday);
        birthdayData.innerHTML = filterFromHtml;
    }

    // filter select
    const selectForMonth = (e) => {
        const filterSelect = select.value;
        // const date = new Date(person.birthday);
        // const month = date.toLocaleString('default', { month: 'long' });
        console.log(filterSelect);
        const filterBirthdayByMonth = data.filter(data => data[new Date(data.birthday).toLocaleString('default', { month: 'long' }).toLowerCase().includes(filterSelect.toLowerCase())] === data.filterSelect);
        const filterBirthdayByMonthHtml = generatedBirthday(filterBirthdayByMonth);
        birthdayData.innerHTML = filterBirthdayByMonthHtml;
    }

    select.addEventListener('change', selectForMonth);

    input.addEventListener('input', searchInput);
    birthdayData.addEventListener('submit', addPeople);
    window.addEventListener('click', popupBirthday);
    window.addEventListener('click', deletedPopup);
    // birthdayData.addEventListener('updatedBirthday', updateLocalStorage);

    initLocalStorage();
}

fetchBirthday();

