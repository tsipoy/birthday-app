console.log("It works");

const endpoint = "./people.json";
const birthdayData = document.querySelector("tbody");

async function fetchBirthday() {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
} 

async function destroyPopup (openPopup) {
    openPopup.classList.remove('open');
    await wait(50);
    openPopup.remove();
    openPopup = null;
}

async function populateBirthday() {
    const days = await fetchBirthday();
    const html = days.map(day => {
        return `
            <tr data-id="${day.id}">
                <td class="picture"><img src="${day.picture}" alt="${day.firstName}"></td>
                <td class="lastname">${day.firstName} ${day.lastName}</td>
                <td class="birthday">Turns 30 on the 31th of December</td>
                <td class="firstname">Days<br>${day.birthday}</td>
                <td class="edit-btn"><button class="edit">Edit</button></td>
                <td class="delete-btn"><button class="delete">Delete</button></td>
            </tr>
    `;
    }).join('');
    birthdayData.innerHTML = html;
}
populateBirthday();

// open modal 

const editPopup = (e) => {
    let editForm = e.target.closest('tr');
    let editLastName = editForm.querySelector('.lastname');
    let editFirstName = editForm.querySelector('.firstname');
    let editBirthday = editForm.querySelector('.birthday');
    let changePicture = editForm.querySelector('.picture');


    return new Promise(async function(resolve) {
        const formPopup = document.createElement('form');
        formPopup.classList.add('popup');
        formPopup.classList.add('open');
        formPopup.insertAdjacentHTML('afterbegin', 
        `
            <fieldset>
                <form>
                    <div class="form-group">
                        <label for="lastname">Lastname</label>
                        <input type="text" class="form-control" id="lastnameId" value="${editLastName.texContent}">
                    </div>
                    <div class="form-group">
                        <label for="firstname">Firstname</label>
                        <input type="text" class="form-control" id="firstnameId" aria-describedby="firstnameHelp" value="${editFirstName.texContent}">
                    </div>
                    <div class="form-group">
                        <label for="birthday">Birthday</label>
                        <input type="text" class="form-control" id="birthdayId" value="${editFirstName.texContent}">
                    </div>
                    <div class="form-group">
                        <label for="url">Your avatar image</label>
                        <input type="url" class="form-control" id="urlId" value="${editFirstName.texContent}">
                    </div>
                    <div class="d-flex flex-row">
                        <button type="submit" class="submit-btn" name="submit">Submit</button>
                        <button class="close-btn" name="close" type="button">Close</button>
                    </div>
                </form>
            </fiedset>
        `)

        // open form
        if(e.target.closest('button.edit')) {
            document.body.appendChild(formPopup);
            formPopup.classList.add('popup');
            await wait(50);
        }

        // submit form
        formPopup.addEventListener('submit', e => {
            e.preventDefault();
            const submitInput = e.target.closest('form');
            const lastNameInput = submitInput.querySelector('#lastnameId').value;
            const firstNameInput = submitInput.querySelector('#firstnameId').value;
            const birthInput = submitInput.querySelector('#birthdayId').value;
            const urlInput = submitInput.querySelector('#urlId').value;

            editLastName.texContent = lastNameInput;
            editFirstName.texContent = firstNameInput;
            editBirthday.texContent = birthInput;
            changePicture.texContent = urlInput;
            destroyPopup(formPopup);
        }, { once: true });

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

// editting popup

const popupBirthday =(e)=> {
    if(e.target.closest('button.edit-btn')) {
        editPopup(e);
    }
}

const deletedData = (e) => {
    return new Promise(async function(resolve) {
        const openDiv = document.createElement('article');
        openDiv.classList.add('open');
        openDiv.insertAdjacentHTML('afterbegin',
        `
            <article class="delete-confirm">
                <p>Are you sure you want to delete it!</p>
                <button class="delete-button" name="deleteBtn" type="button">Delete</button>
                <button class="cancel-button" name="cancel" type="button">Cancel</button>
            </article>
        `
        );
        const confirmDelete = (e) => {
            const cancelBtn = e.target.closest('button.cancel-button');
            const deleteBtn = e.target.closest('button.delete-button');
            if(cancelBtn.cancel) {
                console.log("You cancel it");
                destroyPopup(openDiv);
            }
            if(deleteBtn) {
                console.log("You delete it");
                openDiv.classList.remove('open');
                destroyPopup(openDiv);

            }
        }
        openDiv.addEventListener('click', confirmDelete);
        document.body.appendChild(openDiv);
        //await wait(20);
        openDiv.classList.add('popup');
    })
}

window.addEventListener('click', editPopup);
window.addEventListener('click', deletedData);