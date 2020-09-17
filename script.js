console.log("It works");

const endpoint = "./people.json";
const divWrapper = document.querySelector('#wrapper');
const lastNm = document.querySelector('#addLastname');
const firstNm = document.querySelector('#addFirstname');
const birth = document.querySelector('#addBirthday');
const days = document.querySelector('#addDay');
const avatar = document.querySelector('#addAvatar');
const addButton = document.querySelector(".add-buttton")
const birthdayData = document.querySelector("tbody");

// Add a new birthday
const myNewList = () => {
    const myHtml = `
        <tr class="edit-input">
            <td class="addValue">${avatar.value}</td>
            <td class="addValue">${lastNm.value}</td>
            <td class="addValue">${firstNm.value}</td>
            <td class="addValue">${birth.value}</td>
            <td class="addValue">${days.value}</td>
            <td class="edit-btn">
                <button class="edit">Edit</button>
            </td>
            <td class="delete-btn">
                <button class="delete">Delete</button>
            </td>
        </tr>
    `;
    birthdayData.insertAdjacentHTML('afterbegin', myHtml);    
}

addButton.addEventListener('click', myNewList);

async function fetchBirthday() {

    const response = await fetch(endpoint);
    let data = await response.json();
    
    
    
    async function destroyPopup(openPopup) {
        openPopup.classList.remove('open');
        // await wait(50);
        openPopup.remove();
        openPopup = null;
    }
    
        const displayList = data => {
            birthdayData.innerHTML = data.map((person, day) => {

            const calculateAge = (age) => {
                const msDate = Date.now() - age.getTime();
                const ageDate = new Date(msDate);
                return Math.abs(ageDate.getFullYear() - 1970);
            } 
            const year = calculateAge(new Date(day.birthday));
    
            const date = new Date(day.birthday);
            const month = date.toLocaleString('default', { month: 'long' });
            const birthDay = date.getDate();

            return `
                <tr data-id="${day.id}" class="table-row">
                    <td class="picture"><img src="${person.picture}" alt="${person.firstName}"></td>
                    <td class="lastname" data-value="${person.lastName}">${person.lastName}</td>
                    <td class="firstname" data-value="${person.firstName}">${person.firstName}</td>
                    <td class="birthday">Turns ${year} on the ${birthDay}th of ${month}</td>
                    <td class="leftDay">Days<br></td>
                    <td class="edit-btn">
                        <button class="edit" value="${person.id}">Edit</button>
                    </td>
                    <td class="delete-btn">
                        <button class="delete" value="${person.id}">Delete</button>
                    </td>
                </tr>
        `;
        }).join('');
    }
    // const generatedBirthday = () => {
    //     const html = populateBirthday(data);
    //     // birthdayData.innerHTML = html;
    // }
    // generatedBirthday();
    displayList(data);

    const addPeople = e => {
        e.preventDefault();
        console.log(e);
        const el = e.currentTarget;
        const newPeople = {
            picture: el.picture.value,
            lastName: el.lastName.value,
            firstName: el.firstName.value,
            birthday: el.birthday.getDay(),
            id: Date.now(), 
        };
        people.push(newPeople);
        console.log(newPeople);
        birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
        birthdayData.reset();
    }
    
    // editting popup
    const popupBirthday = (e) => {
        if(e.target.closest('button.edit')) {
            let editForm = e.target.closest('tr');
            const btn = editForm.querySelector('button.edit');
            let id = btn.value;
            editPopup(id);
        }
    }
    
    const deletedPopup = (e) => {
        if(e.target.closest('button.delete')) {
            const deleteTr = e.target.closest('tr');
            const btn = deleteTr.querySelector('button.delete');
            let id = btn.value;
            deletedData(id);
        }
    }
    
     // open modal 
    const editPopup = editId => {
        const editIdPopup = data.find(person => person.id === editId); 
        return new Promise(async function(resolve) {
    
            const formPopup = document.createElement('form');
            formPopup.classList.add('popup');
            formPopup.classList.add('open');
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
                            <input type="text" class="form-control" id="birthdayId" value="${editIdPopup.birthday}">
                        </div>
                        <div class="form-group">
                            <label for="birthday">Days</label>
                            <input type="text" class="form-control" id="dayId" value="${editIdPopup.birthday}">
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
                        //resolve(e.currentTarget.editIdPopup)
                        destroyPopup(formPopup);
                    
                }, { once: true });
    
                // open form
                    document.body.appendChild(formPopup);
                    formPopup.classList.add('open');
                    // await wait(50);
            // close form
            if(formPopup.close) {
                const closeBtn = formPopup.close;
                    closeBtn.addEventListener('click', (e) => {
                    destroyPopup(formPopup);
                    console.log('It is canceled');
                }, { once: true });
            }
        },
        )
    };
    
    const deletedData = deletedId => {
        const deletePeople = data.find(person => person.id  !== deletedId);
        console.log(deletePeople);
        return new Promise(async function(resolve) {
            const openDiv = document.createElement('article');
            openDiv.classList.add('open');
            openDiv.insertAdjacentHTML('afterbegin',
            `
                <article class="delete-confirm">
                    <p>Are you sure you want to delete ${deletePeople.firstName}!</p>
                    <button class="delete-button" name="deleteBtn" type="button">Delete</button>
                    <button class="cancel-button cancel" name="cancel" type="button">Cancel</button>
                </article>
            `
            );
            const confirmDelete = (e) => {
                const cancelBtn = e.target.closest('button.cancel-button');
                if(cancelBtn) {
                    console.log("You cancel it");
                    destroyPopup(openDiv);
                }
            }

            openDiv.addEventListener('click', (e) => {
                if(e.target.closest('button.delete-button')) {
                    let deletePersonBirthday = data.find(person => person.id != deletedId);
                    data = deletePersonBirthday;
                    console.log(deletePersonBirthday);
                    displayList(deletePersonBirthday);
                    // const deletedText = btnDeleted.querySelector('tr');
                    // delete.remove();
                    
                    resolve(deletePersonBirthday);
                    console.log("You delete it");
                    destroyPopup(openDiv);
                }
            });
    
            openDiv.addEventListener('click', confirmDelete);
            document.body.appendChild(openDiv);
            //await wait(20);
            openDiv.classList.add('popup');
        })
    }
    
    // Local storage
    const initLocalStorage = () => {
        const listOfPeope = JSON.parse(localStorage.getItem('people'));
        if(!listOfPeope) {
            people = [];
        } else {
            people = listOfPeope;
        }
        birthdayData.dispatchEvent(new CustomEvent('updatedBirthday')); 
    }
    
    const updatedLocalStorage = () => {
        localStorage.getItem('people', JSON.stringify('people'));
    }

    birthdayData.addEventListener('submit', addPeople);
    birthdayData.addEventListener('updatedBirthday', updatedLocalStorage);
    window.addEventListener('click', popupBirthday);
    window.addEventListener('click', deletedPopup);
    
    initLocalStorage();
} 

fetchBirthday()

