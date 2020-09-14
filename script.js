console.log("It works");

const endpoint = "./people.json";
const birthdayData = document.querySelector("tbody");

async function fetchBirthday() {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
} 

async function populateBirthday() {
    const days = await fetchBirthday();
    const html = days.map(day => {
        return `
            <tr>
                <td class="picture"><img src="${day.picture}" alt="${day.firstName}"></td>
                <td class="last-name">${day.firstName}</td>
                <td class="first-name">${day.lastName}</td>
                <td class="birthday">Turns 30 on the December 13th</td>
                <td class="edit-btn"><button class="edit">Edit</button></td>
                <td class="delete-btn"><button class="delete">Delete</button></td>
            </tr>
    `;
    }).join('');
    birthdayData.innerHTML = html;
}
populateBirthday();

// editting popup

const popupBirthday = e => {
    if(e.target.closest('.edit'));
    editPopup();
}

// open modal 

const editPopup = (e) => {
    let editForm = e.target.closest('tr');
    let editLastName = editForm.querySelector('.last-name');
    console.log(editLastName);
    let editFirstName = editForm.querySelector('.first-name');
    console.log(editFirstName);
    let editBirthday = editForm.querySelector('.birthday');
    console.log(editBirthday);
    let changePicture = editForm.querySelector('.picture');
    console.log(changePicture);


    return new Promise (async function(resolve) {
        const formPopup = document.createElement('form');
        formPopup.classList.add('popup');
        formPopup.classList.add('open');
        formPopup.insertAdjacentHTML('afterbegin', 
        `
            <fieldset>
                <form>
                    <div class="form-group">
                        <label for="lastname">Lastname</label>
                        <input type="text" class="form-control" id="lastname" value="${editLastName.texContent}>
                    </div>
                    <div class="form-group">
                        <label for="firstname">Firstname</label>
                        <input type="text" class="form-control" id="firstname" aria-describedby="firstnameHelp">
                    </div>
                    <div class="form-group">
                        <label for="birthday">Birthday</label>
                        <input type="text" class="form-control" id="birthday" >
                    </div>
                    <div class="form-group">
                        <label for="url">Your avatar image</label>
                        <input type="url" class="form-control" id="url" >
                    </div>
                    <div class="d-flex flex-row">
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button class="btn btn-secondary p-2">Close</button>
                    </div>
                </form>
            </fiedset>
        `)

        if(e.target.closest('.edit')) {
            document.body.appendChild(formPopup);
            formPopup.classList.add('open');
            //await wait(50);

            formPopup.addEventListener('submit', e => {
                e.preventDefault();
                const submitInput = e.target.closest('label');
                console.log(submitInput); 
                const lastNameInput = submitInput.querySelector('#lastname').value;
                console.log(lastNameInput); 

                editLastName.texContent = lastNameInput;
            });
        }
    },
    )
};

window.addEventListener('click', editPopup);