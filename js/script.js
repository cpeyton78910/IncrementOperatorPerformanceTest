// Dark Mode
// Checks if browser has Dark Mode enabled
checkDarkMode();
function checkDarkMode() {
  const darkModeButton = document.getElementById;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkModeButton.innerText = 'Light Mode';
    darkModeToggle();
    console.log('Hello from dark mode');
  }
}
// Toggle On and Off Dark Mode
function darkModeToggle() {
  let body = document.body;
  if (darkModeButton.innerText == 'Dark Mode') {
    body.classList.add('darkMode');
    darkModeButton.innerText = 'Light Mode';
  } else {
    body.classList.remove('darkMode');
    darkModeButton.innerText = 'Dark Mode';
  }
}

document.getElementById('runButton').addEventListener('click', onButtonClick);

let numTestRuns = 0;
let decimalPlaces = 3;

function testPostIncrement() {
  let start = performance.now();
  for (let i = 0; i < 10000000; i++) {
    let x = i++;
  }
  let end = performance.now();
  return end - start;
}

function testPreIncrement() {
  let start = performance.now();
  for (let i = 0; i < 10000000; ++i) {
    let x = ++i;
  }
  let end = performance.now();
  return end - start;
}

function testAdditionAssignment() {
  let start = performance.now();
  for (let i = 0; i < 10000000; i+=1) {
    let x = i += 1;
  }
  let end = performance.now();
  return end - start;
}

function displayStyle (ID, displayType) {
  document.getElementById(ID).style.display = displayType;
}

function onButtonClick() {
  window.scrollTo(0, 0);
  document.body.style.overflow = "hidden";
  displayStyle('loading', 'block');
  displayStyle('testForm', 'none');
  displayStyle('content', 'none');
  displayStyle('pageTitle', 'none');
  setTimeout(runTests, 0); 
}
function runTests() {
  // Change Visibility
  document.body.style.overflow = "auto";
  displayStyle('loading', 'none');
  displayStyle('firstRunP', 'none');
  displayStyle('pageTitle', 'block');
  displayStyle('testForm', 'block');
  displayStyle('content', 'block');
  displayStyle('runAgainP', 'block');
  
  numTestRuns = Number(document.getElementById('numberInput').value);
  // Changes what's displaying depending on if only 1 test is ran
  if (numTestRuns <= 1) {
    numTestRuns = 1;
    document.getElementById('numberInput').value = 1;
    displayStyle('tableAndHeader', 'none');
    displayStyle('tableButton', 'none');
  } else {
    if (buttonToggle == true) {
      displayStyle('tableAndHeader', 'block');
    }
    displayStyle('tableButton', 'inline-block');
  }

  let postIncrementTimes = [];
  let preIncrementTimes = [];
  let additionAssignmentTimes = [];

  for (let i = 0; i < numTestRuns; i++) {
    postIncrementTimes.push(testPostIncrement());
    preIncrementTimes.push(testPreIncrement());
    additionAssignmentTimes.push(testAdditionAssignment());
  }

  let postIncrementAverage = average(postIncrementTimes);
  let preIncrementAverage = average(preIncrementTimes);
  let additionAssignmentAverage = average(additionAssignmentTimes);

  updateRanking([
    { name: 'Post-Increment (i++)', average: postIncrementAverage, times: postIncrementTimes },
    { name: 'Pre-Increment (++i)', average: preIncrementAverage, times: preIncrementTimes },
    { name: 'Addition Assignment (i+=1)', average: additionAssignmentAverage, times: additionAssignmentTimes }
  ]);

  updateTable(postIncrementTimes, preIncrementTimes, additionAssignmentTimes, postIncrementAverage, preIncrementAverage, additionAssignmentAverage);

}

function updateRanking(results) {
  results.sort((a, b) => parseFloat(a.average) - parseFloat(b.average));
  console.log('Results Array:')
  console.log(results.map(v => v.average[0]));
  let rankingList = document.getElementById('results');
  rankingList.innerHTML = '';
  results.forEach((result, index) => {
    let nameParts = result.name.split(' ');
    let boldPart = nameParts.slice(0, -1).join(' ');
    let restPart = nameParts.slice(-1)[0];
    let listItem = document.createElement('div');
    // Set's Results
    if (numTestRuns == 1) {
      listItem.innerHTML = `<span class="bold">${index + 1}. ${boldPart}</span> ${restPart}:<br><span class="indent"><span class="bold">Time:</span> ${parseFloat(result.average).toFixed(decimalPlaces)} ms</span><br><br>`;
    } else { // Greater than 1
      let timesArray = result.times; // Make sure times array is available
      let sortedTimes = [...timesArray].sort((a, b) => a - b); // Sort to find min, max & median
      let fastest = sortedTimes[0];
      let slowest = sortedTimes[sortedTimes.length - 1];
    
      listItem.innerHTML = `<span class="bold">${index + 1}. ${boldPart}</span> ${restPart}:<br>
        <span class="indent"><span class="bold">Average Time:</span> ${parseFloat(result.average).toFixed(decimalPlaces)} ms</span><br>
        <span class="indent"><span class="bold">Fastest Time:</span> ${fastest.toFixed(decimalPlaces)} ms</span><br>
        <span class="indent"><span class="bold">Slowest Time:</span> ${slowest.toFixed(decimalPlaces)} ms</span><br><br>`;
    }    
    rankingList.appendChild(listItem);
  });

  document.getElementById('fastest').innerText = results[0].name;
  document.getElementById('secondFastest').innerText = results[1].name;
  document.getElementById('slowest').innerText = results[2].name;

  document.getElementById('fastestAverage').innerText = parseFloat(results[0].average).toFixed(decimalPlaces) + ' ms';
  document.getElementById('secondFastestAverage').innerText = parseFloat(results[1].average).toFixed(decimalPlaces) + ' ms';
  document.getElementById('slowestAverage').innerText = parseFloat(results[2].average).toFixed(decimalPlaces) + ' ms';
}

function updateTable(postIncrementTimes, preIncrementTimes, additionAssignmentTimes, postIncrementAverage, preIncrementAverage, additionAssignmentAverage) {
  let tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = '';

  // Make array
  let sortedVars = [
    { times: postIncrementTimes, average: postIncrementAverage },
    { times: preIncrementTimes, average: preIncrementAverage },
    { times: additionAssignmentTimes, average: additionAssignmentAverage }
  ]
  // Sort array
  sortedVars.sort((a, b) => parseFloat(a.average) - parseFloat(b.average));
  console.log('Table Array:')
  console.log(sortedVars.map(v => v.average[0]));

  // Make Table
  for (let i = 0; i < numTestRuns; i++) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerText = i + 1;
    cell2.innerText = sortedVars[0].times[i].toFixed(decimalPlaces);
    cell3.innerText = sortedVars[1].times[i].toFixed(decimalPlaces);
    cell4.innerText = sortedVars[2].times[i].toFixed(decimalPlaces);
  }
}

function average(times) {
  let avg = times.reduce((a, b) => a + b, 0) / times.length;
  return avg.toFixed(decimalPlaces);
}

// Toggle Table Script
let buttonToggle = true;
function toggleTable() {
  let table = document.getElementById('tableAndHeader');
  let button = document.getElementById('tableButton');
  
  // Toggle between 'none' and 'block'
  if (buttonToggle == false && numTestRuns > 1) {
    table.style.display = 'block';
    button.innerText = 'Hide Table';
    buttonToggle = true;
  } else {
    table.style.display = 'none';
    button.innerText = 'Show Table';
    buttonToggle = false;
  }
}

// Loading Position Script
window.addEventListener('resize', adjustLoadingPosition);
window.addEventListener('load', adjustLoadingPosition);
function adjustLoadingPosition() {
  const loadingElement = document.getElementById('loading');
  const viewportHeight = window.innerHeight;
  const marginTop = (viewportHeight*0.65);
  loadingElement.style.marginTop = `${marginTop}px`;
}

// Scroll To Top Button
// Create the button element
let mybutton = document.createElement("button");
mybutton.id = "myBtn";
mybutton.innerHTML = "&#x25B2;"; // Upward arrow
mybutton.title = "Go to top";

// Apply styles dynamically
Object.assign(mybutton.style, {
  display: "none",
  position: "fixed",
  bottom: "30px",
  right: "30px",
  zIndex: "99",
  fontSize: "2rem",
  border: "none",
  outline: "none",
  backgroundColor: "rgba(0, 0, 0, .6)",
  color: "white",
  cursor: "pointer",
  padding: "15px",
  borderRadius: "40%",
  opacity: "0",
  textAlign: "center",
  width: "4rem",
  height: "4rem",
  transition: "opacity 0.3s ease, background-color 0.3s ease",
  alignItems: "center", /* Centers vertically */
  justifyContent: "center", /* Centers horizontally */
});

// Hover effect (prevent hiding while hovered)
mybutton.onmouseover = () => {
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  }
  if (!isMobile()) {
    mybutton.style.backgroundColor = "#555";
  clearTimeout(hideTimeout); // Stop hiding when hovered
  }
};
mybutton.onmouseout = () => {
  mybutton.style.backgroundColor = "rgba(0, 0, 0, .6)";
  hideButtonAfterDelay(); // Restart hide timer on mouse out
};

// Append button to body
document.body.appendChild(mybutton);

let hideTimeout;

// Function to hide the button after inactivity
function hideButtonAfterDelay() {
  hideTimeout = setTimeout(() => {
    mybutton.style.opacity = "0";
    setTimeout(() => mybutton.style.display = "none", 300);
  }, 1500); // Hide after 2 seconds of inactivity
}

// Add scroll event listener to show/hide button
window.addEventListener("scroll", () => {
  clearTimeout(hideTimeout); // Cancel previous hide timer

  if (document.documentElement.scrollTop > 200) {
    mybutton.style.display = "flex";
    mybutton.style.opacity = ".8";

    // Start hide timer after scroll stops **only if NOT hovered**
    if (!mybutton.matches(":hover")) {
      hideButtonAfterDelay();
    }
  } else {
    mybutton.style.opacity = "0";
    mybutton.style.display = "none";
  }
});

// Smooth scroll to top when button is clicked
mybutton.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  mybutton.style.opacity = "0";
  mybutton.style.display = "none";
};
