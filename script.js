console.log("It works");

const endpoint = "./people.json";
const addButton = document.querySelector(".add-buttton")
const birthdayData = document.querySelector("tbody");

async function fetchBirthday() {

    const response = await fetch(endpoint);
    let data = await response.json();
    
    
    async function destroyPopup(openPopup) {
        openPopup.classList.remove('open');
        // await wait(50);
        openPopup.remove();
        openPopup = null;
    }
    
        const populateBirthday = people => {
            return people.map(person => {
            const calculateAge = (age) => {
                const msDate = Date.now() - age.getTime();
                const ageDate = new Date(msDate);
                return Math.abs(ageDate.getFullYear() - 1970);
            } 
            const year = calculateAge(new Date(person.birthday));
    
            const date = new Date(person.birthday);
            const month = date.toLocaleString('default', { month: 'long' });
            const birthDay = date.getDate();

            return `
                <tr data-id="${person.id}" class="table-row">
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
        }).join('')};
        const generatedBirthday = () => {
            const html = populateBirthday(data);
            birthdayData.innerHTML = html;
        }
        generatedBirthday();
        // displayList(data);

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

    const addEditPopup = (e) => {
        if(e.target.closest('.add-buttton')) {
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
            <div class="form-grou">
                <label for="addLastname" class="lastname-label">Lastname</label>
                <input type="text" class="form-control" id="addLastname">
            </div>
            <div class="form-group">
                <label for="addFirstname" class="firstname-label">Firstname</label>
                <input type="text" class="form-control" id="addFirstname" aria-describedby="firstnameHelp">
            </div>
            <div class="form-group">
                <label for="addBirthday" class="birthday-label">Birthday</label>
                <input type="text" class="form-control" id="addBirthday">
            </div>
            <div class="form-group">
                <label for="addAvatar" class="avatar">Picture(Url)</label>
                <input type="url" class="form-control" id="addAvatar">
            </div>
            <div class="d-flex flex-row">
                <button type="submit" class="submitbtn" name="submit">Submit</button>
                <button class="close-btn" name="close" type="button">Close</button>
            </div>
        </fiedset>
        `)

        // submit form 
            addFormPopup.addEventListener('submit', e => { 
                e.preventDefault();
                    let submitAddForm = e.target;
                    submitAddForm.lastName = addFormPopup.addLastname.value;
                    submitAddForm.firstName = addFormPopup.addFirstname.value;
                    submitAddForm.birthday = addFormPopup.addBirthday.value;
                    submitAddForm.picture = addFormPopup.addAvatar.value;
                    const newPeople = {
                        picture: submitAddForm.picture,
                        lastName: submitAddForm.lastName,
                        firstName: submitAddForm.firstName,
                        birthday: submitAddForm.birthday,
                        id: Date.now(), 
                    };
                    data.push(newPeople);
                    console.log(newPeople);
                    generatedBirthday(addFormPopup);
                    //resolve(e.currentTarget.editIdPopup)
                    destroyPopup(addFormPopup);
                
            }, { once: true });

            // open form
                document.body.appendChild(addFormPopup);
                addFormPopup.classList.add('open');
                // await wait(50);
        // close form
        if(addFormPopup.close) {
            const closeAddBtn = addFormPopup.close;
                closeAddBtn.addEventListener('click', (e) => {
                destroyPopup(addFormPopup);
                console.log('It is canceled');
            }, { once: true });
        }
    };

    addButton.addEventListener("click", editAddPopup);
    
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
            let id = btn;
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
                        // resolve(e.target.displayList(editIdPopup));
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
                    console.log(data);
                    let deleteData = data;
                    const deletePersonBirthday = deleteData.find(person => person.id !== deletedId);
                    deleteData = deletePersonBirthday;
                    console.log(deleteData);
                    console.log(deletePersonBirthday);
                    // generatedBirthday(deletePersonBirthday);
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

fetchBirthday();

