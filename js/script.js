// Loading Position Script
window.addEventListener('resize', adjustLoadingPosition);
window.addEventListener('load', adjustLoadingPosition);
function adjustLoadingPosition() {
  const loadingElement = document.getElementById('loading');
  const viewportHeight = window.innerHeight;
  const marginTop = (viewportHeight*0.65);
  loadingElement.style.marginTop = `${marginTop}px`;
}

// Main Scripts
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
  displayStyle('loading', 'block');
  displayStyle('testForm', 'none');
  displayStyle('content', 'none');
  displayStyle('pageTitle', 'none');
  setTimeout(runTests, 0); 
}
function runTests() {
  // Change Visibility
  displayStyle('loading', 'none');
  displayStyle('firstRunP', 'none');
  displayStyle('pageTitle', 'block');
  displayStyle('testForm', 'block');
  displayStyle('content', 'block');
  displayStyle('runAgainP', 'block');
  
  numTestRuns = document.getElementById('numberInput').value;
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
    { name: 'Post-Increment (i++)', average: postIncrementAverage },
    { name: 'Pre-Increment (++i)', average: preIncrementAverage },
    { name: 'Addition Assignment (i+=1)', average: additionAssignmentAverage }
  ]);

  updateTable(postIncrementTimes, preIncrementTimes, additionAssignmentTimes, postIncrementAverage, preIncrementAverage, additionAssignmentAverage);

}

function updateRanking(results) {
  results.sort((a, b) => parseFloat(a.average) - parseFloat(b.average));
  let rankingList = document.getElementById('results');
  rankingList.innerHTML = '';
  results.forEach((result, index) => {
    let nameParts = result.name.split(' ');
    let boldPart = nameParts.slice(0, -1).join(' ');
    let restPart = nameParts.slice(-1)[0];
    let listItem = document.createElement('div');
    listItem.innerHTML = `<span class="bold">${index + 1}. ${boldPart}</span> ${restPart}:<br><span class="indent"><span class="bold">Average Time:</span> ${parseFloat(result.average).toFixed(decimalPlaces)} ms</span>`;
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
  for (let i = 0; i < numTestRuns; i++) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    cell1.innerText = i + 1;
    cell2.innerText = postIncrementTimes[i].toFixed(decimalPlaces);
    cell3.innerText = preIncrementTimes[i].toFixed(decimalPlaces);
    cell4.innerText = additionAssignmentTimes[i].toFixed(decimalPlaces);
  }
}

function average(times) {
  return (times.reduce((a, b) => a + b) / times.length).toFixed(decimalPlaces);
}
