console.log("It works");

const endpoint = "./people.json";
const birthdayData = document.querySelector("tbody");

async function fetchBirthday() {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
} 

async function destroyPopup(openPopup) {
    openPopup.classList.remove('open');
    // await wait(50);
    openPopup.remove();
    openPopup = null;
}

async function populateBirthday() {
    const days = await fetchBirthday();
    const html = days.map(day => {
        const calculateAge = (age) => {
            const msDate = Date.now() - age.getTime();
            const ageDate = new Date(msDate);
            return Math.abs(ageDate.getFullYear() - 1970);
        } 
        const year = calculateAge(new Date(day.birthday));

        const date = new Date(day.birthday);
        const month = date.toLocaleString('default', { month: 'long' });
        const birthDay = date.getDate();

        today = new Date();
        

        // const month = refactorDate.getMonth();
        // const days = refactorDate.getDay();
        // const fullDate = year + " " + month + " " + days;
        // console.log(fullDate);
        return `
            <tr data-id="${day.id}" class="table-row">
                <td class="picture"><img src="${day.picture}" alt="${day.firstName}"></td>
                <td class="lastname" data-value="${day.lastName}">${day.lastName}</td>
                <td class="firstname" data-value="${day.firstName}">${day.firstName}</td>
                <td class="birthday">Turns ${year} on the ${birthDay}th of ${month}</td>
                <td class="leftDay">Days<br></td>
                <td class="edit-btn">
                    <button class="edit" value="${day.id}">Edit</button>
                </td>
                <td class="delete-btn">
                    <button class="delete" value="${day.id}">Delete</button>
                </td>
            </tr>
    `;
    }).join('');
    birthdayData.innerHTML = html;
}
populateBirthday();

let people = [];

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
        editPopup(e);
    }
}

const deletedPopup = (e) => {
    if(e.target.closest('button.delete')) {
        deletedData(e);
    }
}

// open modal 
const editPopup = e => {
    let editForm = e.target.closest('tr');
    let editLastName = editForm.querySelector('.lastname').textContent;
    let editFirstName = editForm.querySelector('.firstname').textContent;
    let editBirthday = editForm.querySelector('.birthday').textContent;
    let editDay = editForm.querySelector('.leftDay').textContent
    let changePicture = editForm.querySelector('.picture').textContent;
    console.log(editLastName)
    return new Promise(async function(resolve) {

        const formPopup = document.createElement('form');
        formPopup.classList.add('popup');
        formPopup.classList.add('open');
        formPopup.insertAdjacentHTML('afterbegin', 
        `
            <fieldset> 
                    <div class="form-group">
                        <label for="lastname">Lastname</label>
                        <input type="text" class="form-control" id="lastnameId" value="${editLastName}">
                    </div>
                    <div class="form-group">
                        <label for="firstname">Firstname</label>
                        <input type="text" class="form-control" id="firstnameId" aria-describedby="firstnameHelp" value="${editFirstName}">
                    </div>
                    <div class="form-group">
                        <label for="birthday">Birthday</label>
                        <input type="text" class="form-control" id="birthdayId" value="${editBirthday}">
                    </div>
                    <div class="form-group">
                        <label for="birthday">Days</label>
                        <input type="text" class="form-control" id="dayId" value="${editDay}">
                    </div>
                    <div class="form-group">
                        <label for="url">Your avatar image</label>
                        <input type="url" class="form-control" id="urlId" value="${changePicture}">
                    </div>
                    <div class="d-flex flex-row">
                        <button type="submit" class="submit-btn" name="submit">Submit</button>
                        <button class="close-btn" name="close" type="button">Close</button>
                    </div>
        
            </fiedset>
        `)

        // submit form
        if(e.target.closest('button.edit')) {
            formPopup.addEventListener('submit', e => {
                e.preventDefault();
                const submitInput = e.target.closest('form');
                const lastNameInput = submitInput.querySelector('#lastnameId').value;
                const firstNameInput = submitInput.querySelector('#firstnameId').value;
                const birthInput = submitInput.querySelector('#birthdayId').value;
                const daysInput = submitInput.querySelector('#dayId').value;
                const urlInput = submitInput.querySelector('#urlId').value;

                editLastName.textContent = lastNameInput;
                editFirstName.textContent = firstNameInput;
                editBirthday.textContent = birthInput;
                editDay.textContent = daysInput;
                changePicture.textContent = urlInput;
                editPopup(formPopup);
                destroyPopup(formPopup);
            }, { once: true });

            // open form
                document.body.appendChild(formPopup);
                formPopup.classList.add('open');
                // await wait(50);
        }
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

const deletedData = (e) => {
    return new Promise(async function(resolve) {
        const openDiv = document.createElement('article');
        openDiv.classList.add('open');
        openDiv.insertAdjacentHTML('afterbegin',
        `
            <article class="delete-confirm">
                <p>Are you sure you want to delete it!</p>
                <button class="delete-button" name="deleteBtn" type="button">Delete</button>
                <button class="cancel-button cancel" name="cancel" type="button">Cancel</button>
            </article>
        `
        );
        const confirmDelete = (e) => {
            const cancelBtn = e.target.closest('button.cancel-button');
            const deleteBtn = e.target.closest('button.delete-button');
            if(cancelBtn) {
                console.log("You cancel it");
                destroyPopup(openDiv);
            }

            if(deleteBtn) {
                console.log("You delete it");
                const id = Number(deleteBtn.value);
                deletedTr(id);
                destroyPopup(openDiv);

            }
        }

        const deletedTr = deletedId => {
            people = people.filter(person => person.deletedId !== deletedId);
            birthdayData.dispatchEvent(new CustomEvent('updatedBirthday'));
        }

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