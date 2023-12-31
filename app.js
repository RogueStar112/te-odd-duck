// const fs = require("fs");

// CHANGEABLE PARAMETERS ///////
let roundsLeft = 10;

let noOfImagesInGame = 4;
////////////////////////////////

let pastCharts = [];

if (localStorage.getItem("pastCharts")) {
  console.log("Past charts found!")
  pastCharts = JSON.parse(localStorage.getItem("pastCharts"));
} 

let imageElementIds = [];

let previousImagesArray = [];

function renderImagePlaceholders() {
  // added +1 because img starts at 1.
  for (let i = 1; i < noOfImagesInGame + 1; i++) {
    let imageObj = {
      containerSelector: `img${i}-container`,
      imgSelector: `img${i}`,
      textSelector: `img${i}_text`,
    };

    imageElementIds.push(imageObj);
  }

  let imagesContainer = document.getElementById("images-container");

  for (i = 0; i < noOfImagesInGame; i++) {
    // The HTML equivalent is shown in index.html (lines 38+)
    let newImageContainer = document.createElement("div");
    newImageContainer.setAttribute("id", imageElementIds[i].containerSelector);

    let newImage = document.createElement("img");
    newImage.setAttribute("id", imageElementIds[i].imgSelector);

    let newImageText = document.createElement("section");
    newImageText.setAttribute("id", imageElementIds[i].textSelector);

    newImageContainer.appendChild(newImage);
    newImageContainer.appendChild(newImageText);

    imagesContainer.appendChild(newImageContainer);
  }
}

function Product(name, src) {
  this.name = name;
  this.src = src;
  this.times_shown = 0;
  this.times_voted = 0;
}

Product.prototype.selectImage = function () {
  if (roundsLeft > 0) {
    this.times_voted++;
    roundsLeft--;
    // console.log(
    //   `Voted image: ${this.name}. You voted for this ${this.times_voted}`
    // );

    resetVoteListeners();
    renderVoteImages(previousImagesArray);
    renderRoundsLeft();
  } else {
    //   showResultsButton();
  }
};

let imageList = [
  new Product("Bag", "./assets/bag.jpg"),
  new Product("Banana", "./assets/banana.jpg"),
  new Product("Bathroom", "./assets/bathroom.jpg"),
  new Product("Boots", "./assets/boots.jpg"),
  new Product("Breakfast", "./assets/breakfast.jpg"),
  new Product("Bubblegum", "./assets/bubblegum.jpg"),
  new Product("Chair", "./assets/chair.jpg"),
  new Product("Cthulhu", "./assets/cthulhu.jpg"),
  new Product("Dog Duck", "./assets/dog-duck.jpg"),
  new Product("Dragon", "./assets/dragon.jpg"),
  new Product("Pen", "./assets/pen.jpg"),
  new Product("Pet Sweep", "./assets/pet-sweep.jpg"),
  new Product("Scissors", "./assets/scissors.jpg"),
  new Product("Shark", "./assets/shark.jpg"),
  new Product("Sweep", "./assets/sweep.png"),
  new Product("Tauntaun", "./assets/tauntaun.jpg"),
  new Product("Unicorn", "./assets/unicorn.jpg"),
  new Product("Water Can", "./assets/water-can.jpg"),
  new Product("Wine Glass", "./assets/wine-glass.jpg"),
];

// credit to: https://byby.dev/js-sort-by-object-property
function compareByVotes(a, b) {
  return b.times_voted - a.times_voted;
}

function returnRandomImageID() {
  return Math.floor(Math.random() * imageList.length);
}

function resetVoteListeners() {
  // credit to: https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
  /* Why is this needed?

    Adding event listeners to individual images creates a lot of gunk, so this clears any excess.

  */
  for (let i = 0; i < imageElementIds.length; i++) {
    let containerSelected = document.getElementById(
      imageElementIds[i].containerSelector
    );

    let cloneOfImgSelected = containerSelected.cloneNode(true);

    containerSelected.parentNode.replaceChild(
      cloneOfImgSelected,
      containerSelected
    );
  }
}

function renderVoteImages(prevArray = []) {
  if (roundsLeft === 0) {
    alert("Voting is over. You may now see the results.");
    showResultsButton();
  } else {
    let imageNumberArray = [];
    previousImagesArray = [];

    /* Okay, what in the holy name is this while loop doing you may ask...
    It prevents duplicates from appearing on the array. */

    while (imageNumberArray.length < noOfImagesInGame) {
      let randomID = returnRandomImageID();

      if (
        imageNumberArray.indexOf(randomID) !== -1 ||
        prevArray.indexOf(randomID) !== -1
      ) {
        imageNumberArray.splice(imageNumberArray.indexOf(randomID), 1);
      } else {
        imageNumberArray.push(randomID);
      }
    }

    /* Prevents previous images from being shown consistently each round. */
    for (let i = 0; i < imageNumberArray.length; i++) {
      previousImagesArray.push(imageNumberArray[i]);
    }

    // console.log("PREV IMAGES ARRAY", previousImagesArray);

    for (i = 0; i < imageNumberArray.length; i++) {
      let containerSelected = document.getElementById(
        imageElementIds[i].containerSelector
      );
      let imgSelected = document.getElementById(imageElementIds[i].imgSelector);
      let textSelected = document.getElementById(
        imageElementIds[i].textSelector
      );

      let productSelected = imageList[imageNumberArray[i]];

      productSelected.times_shown++;

      imgSelected.setAttribute("src", imageList[imageNumberArray[i]].src);

      textSelected.textContent = imageList[imageNumberArray[i]].name;

      containerSelected.addEventListener("click", function () {
        productSelected.selectImage();
      });
    }
  }
  // }
}

function renderRoundsLeft() {
  let rounds = document.getElementById("rounds-left");
  rounds.textContent = roundsLeft;
}

function renderVotes() {
  sortData();
  let votesTable = document.getElementById("votes-tbody");

  for (i = 0; i < imageListSorted.length; i++) {
    let tr = document.createElement("tr");

    let numberTd = document.createElement("td");

    if (i == 0) {
      numberTd.classList.add("first-place");
    } else if (i == 1) {
      numberTd.classList.add("second-place");
    } else if (i == 2) {
      numberTd.classList.add("third-place");
    }

    let nameTd = document.createElement("td");
    let votesTd = document.createElement("td");

    numberTd.textContent = i;
    nameTd.textContent = imageListSorted[i].name;
    votesTd.textContent = imageListSorted[i].times_voted;

    tr.appendChild(numberTd);
    tr.appendChild(nameTd);
    tr.appendChild(votesTd);
    votesTable.appendChild(tr);
  }

  // let votes = document.getElementById("votes");

  // // RENDERS LIST ON LEFT
  // let ol = document.createElement("ol");

  // for (let i = 0; i < imageList.length; i++) {
  //   let li = document.createElement("li");
  //   li.textContent = `#${i + 1}: ${imageList[i].name}: ${
  //     imageList[i].times_voted
  //   } votes`;
  //   ol.appendChild(li);
  // }

  // votes.appendChild(ol);

  let graphContainer = document.getElementById("graph");

  const ctx = document.getElementById("graph-container");
  // ctx.canvas.parentNode.style.height = "128px";
  // ctx.canvas.parentNode.style.width = "128px";

  let graphLabels = [];
  let graphData_votes = [];
  let graphData_shown = [];

  for (i = 0; i < imageListSorted.length; i++) {
    if (imageListSorted[i].times_shown != 0) {
      graphLabels.push(imageListSorted[i].name);
      graphData_votes.push(imageListSorted[i].times_voted);
      graphData_shown.push(imageListSorted[i].times_shown);
    }
  }

  const config = new Chart(ctx, {
    type: "bar",
    data: {
      labels: graphLabels,
      datasets: [
        {
          type: "bar",
          label: "# of votes",
          data: graphData_votes,
          // borderWidth: 6,
          backgroundColor: ["red", "green", "skyblue", "purple", "orange"],
        },
        {
          type: "bar",
          label: "# of times shown",
          data: graphData_shown,
          // borderWidth: 6,
          backgroundColor: ["lightgrey"],
        },
      ],
    },
    options: {
      scales: {
        x: {
          stacked: true,
        },
      },
    },
  });

  storeDataLocally();
}

let showResultsBtn = document.getElementById("show-results");

function showResultsButton() {
  showResultsBtn.setAttribute("class", "");
}

showResultsBtn.addEventListener("click", renderVotes, { once: true });

function storeDataLocally() {
  const productsStringified = JSON.stringify(imageList);

  localStorage.setItem("products", productsStringified);

  pastCharts.push(imageListSorted);

  localStorage.setItem("pastCharts", JSON.stringify(pastCharts));
}

function retrieveDataLocally() {
  const parseProductData = JSON.parse(localStorage.getItem("products"));
  const parsePastCharts = JSON.parse(localStorage.getItem("pastCharts"));

  if (parseProductData) {
    // console.log("IL", imageList);
    // console.log("PPD", parseProductData);
    // console.log(imageList === parseProductData);

    for (let i = 0; i < imageList.length; i++) {
      if (imageList[i].name === parseProductData[i].name) {
        imageList[i].times_shown = parseProductData[i].times_shown;
        imageList[i].times_voted = parseProductData[i].times_voted;
      }
    }

    console.log("Data retrieved successfully!");
  } else {
    console.log("Data not retrieved.");
  }

  if (parsePastCharts) {
    console.log("Past charts data retrieved successfully!") 
    console.log("pC", parsePastCharts);
  } else {
    console.log("Past charts data NOT retrieved successfully.")
  }
}

let imageListSorted = [...imageList];

function sortData() {
  imageListSorted.sort(function (a, b) {
    return compareByVotes(a, b);
  });
}

// At the start of the program, call these.
renderImagePlaceholders();
renderVoteImages();
renderRoundsLeft();
retrieveDataLocally();
sortData();

console.log("ILS", imageListSorted);

/* 
function resetVoteListeners();
credit to: https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element

Credit to GJ for the stacked chart idea.
*/
