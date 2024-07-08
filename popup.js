document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getPrestyleElements,
      },
      (injectionResults) => {
        const prestyleElements = injectionResults[0].result;
        const elementsTable = document.getElementById('elementsTable');

        prestyleElements.forEach(element => {
          const row = document.createElement('tr');
          const cell = document.createElement('td');
          cell.textContent = element;
          row.appendChild(cell);
          elementsTable.appendChild(row);
        });
      }
    );
  });

  document.getElementById('copyButton').addEventListener('click', function () {
    const elementsTable = document.getElementById('elementsTable');
    const range = document.createRange();
    range.selectNode(elementsTable);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Table copied to clipboard');
  });
});

function getPrestyleElements() {
  const elements = document.querySelectorAll('.prestyle');
  return Array.from(elements).map(element => element.textContent.trim());
}
