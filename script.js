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
                <td><img src="${day.picture}" alt="${day.firstName}"></th>
                <td>${day.lastName} ${day.firstName}</td>
                <td>Turns 30 on the December 13th</td>
                <td><button class="edit">Edit</button></td>
                <td><button class="delete">Delete</button></td>
            </tr>
    `;
    }).join('');
    console.log(html);
    birthdayData.innerHTML = html;
}
populateBirthday();