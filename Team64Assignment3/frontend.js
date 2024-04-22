// Author: Edmund Lim
//     ISU Netid : elim655@iastate.edu
//     Date :  April 15, 2024

async function loadRobots() {
    try {
        const response = await fetch('http://localhost:8081/listRobots');
        const robots = await response.json();
        const robotCards = document.getElementById("col");
        robotCards.innerHTML = ""; // Clear existing cards

        robots.forEach((robot, index) => {
            const cardHTML = `
            <div class="card shadow-sm">
                <img src=${robot.imageUrl} class="card-img-top" alt="${robot.name}" ></img>
                <div class="card-body">
                  <p class="card-text">${robot.id} <strong>${robot.name}</strong>, $${robot.price}</p>
                  <p>${robot.description}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                    </div>
                  </div>
                </div>
              </div>`;
            robotCards.innerHTML += cardHTML;
        });
    } catch (error) {
        console.error('Error loading robots:', error);
    }
}

function showOneRobot(){
  let id = document.getElementById("robotId").value;
  console.log(id);

  fetch(`http://localhost:8081/${id}`)
  .then(response => response.json())
  .then(myRobot => {loadOneRobot(myRobot)});

  function loadOneRobot(myRobot){
    var CardRobot = document.getElementById("col2");

    let id = myRobot.id;
    let name = myRobot.name;
    let price = myRobot.price;
    let description = myRobot.description;
    let imageUrl = myRobot.imageUrl;

    let AddCardRobot = document.createElement("div");
    AddCardRobot.classList.add("col2");

    AddCardRobot.innerHTML = `
    <div class="card shadow-sm">
        <img src=${imageUrl} class="card-img-top" alt="${name}" ></img>
                <div class="card-body">
                  <p class="card-text">${id} <strong>${name}</strong>, $${price}</p>
                  <p>${description}</p>
                  </div>
      </div>`;

    CardRobot.appendChild(AddCardRobot);
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const addProductForm = document.getElementById('addProductForm');
  
    addProductForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const formData = new FormData(addProductForm);
      const productData = Object.fromEntries(formData.entries());
  
      // Convert rating to an object
      productData.rating = {
        rate: parseFloat(productData.rating), 
        count: parseInt(productData.ratingCount) 
      };
  
      addNewProduct(productData);
    });
  });
  
  function addNewProduct(productData) {
    fetch('http://localhost:8081/addProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
    .then(response => {
      if (response.status !== 200) {
        return response.json()
        .then(errData => {
          throw new Error(`POST response was not ok:\nStatus: ${response.status}\nError: ${errData.error}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      alert('Product added successfully!');
    })
    .catch(error => {
      console.error('Error adding product:', error);
      alert('Error adding product:' + error.message);
    });
  }
  
  

function deleteOneRobot() {
  // Fetch the value from the input field
  let id = document.getElementById("deleteRobotById").value;
  console.log(id);
  
  fetch(`http://localhost:8081/deleteRobot/${id}`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(
      { "id":id}
    )
  })
  .then(response => response.json())
  .then(deleteThisRobot => {deleteOneRobotById(deleteThisRobot)});

  function deleteOneRobotById(deleteThisRobot){
    var CardRobot = document.getElementById("col3");

    let id = deleteThisRobot.id;
    let name = deleteThisRobot.name;
    let price = deleteThisRobot.price;
    let description = deleteThisRobot.description;
    let imageUrl = deleteThisRobot.imageUrl;

    let AddCardRobot = document.createElement("div");
    AddCardRobot.classList.add("col3");

    AddCardRobot.innerHTML = `
    <div><h3> Robot Deleted </h3> </div>
    <div class="card shadow-sm">
        <img src=${imageUrl} class="card-img-top" alt="${name}" ></img>
                <div class="card-body">
                  <p class="card-text">${id} <strong>${name}</strong>, $${price}</p>
                  <p>${description}</p>
                  </div>
    </div>`;

    CardRobot.appendChild(AddCardRobot);
  }
}

function updateOneRobot() {
  // Fetch the value from the input field
  let id = document.getElementById("updateRobotById").value;
  console.log(id);
  fetch(`http://localhost:8081/updateRobot/${id}`, {
  method: 'PUT',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(
  {
  "name": "Robot Abraham ALDACO-GASTELUM",
  "price": 100.90,
  "description": "I robot is one example of an image for my exercise",
  "imageUrl": "https://robohash.org/Abraham"
  }
  )
  })
  .then(response => response.json())
  .then(updateThisRobot => {updateOneRobotById(updateThisRobot)});

  function updateOneRobotById(updateThisRobot){
    var CardRobot = document.getElementById("col4");

    let id = updateThisRobot.id;
    let name = updateThisRobot.name;
    let price = updateThisRobot.price;
    let description = updateThisRobot.description;
    let imageUrl = updateThisRobot.imageUrl;

    let AddCardRobot = document.createElement("div");
    AddCardRobot.classList.add("col4");

    AddCardRobot.innerHTML = `
    <div><h3> Robot Updated From </h3> </div>
    <div class="card shadow-sm">
        <img src=${imageUrl} class="card-img-top" alt="${name}" ></img>
                <div class="card-body">
                  <p class="card-text">${id} <strong>${name}</strong>, $${price}</p>
                  <p>${description}</p>
                  </div>
    </div>
    <div><h3> Robot Updated To </h3> </div>
    <div class="card shadow-sm">
        <img src=https://robohash.org/Abraham class="card-img-top" alt="Robot Abraham ALDACO-GASTELUM" ></img>
                <div class="card-body">
                  <p class="card-text">${id} <strong>Robot Abraham ALDACO-GASTELUM</strong>, 100.90</p>
                  <p>I robot is one example of an image for my exercise</p>
                  </div>
    </div>`;

    CardRobot.appendChild(AddCardRobot);
  }
}