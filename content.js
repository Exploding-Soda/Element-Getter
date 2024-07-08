function extractElements() {
  let elements = document.querySelectorAll('.alert.alert-success.dismiss');
  let result = [];

  elements.forEach(element => {
    let strongText = element.querySelector('strong').innerText;
    let preElement = element.nextElementSibling;

    if (preElement && preElement.classList.contains('prestyle')) {
      let preText = preElement.innerText.trim();
      let rowNumber = strongText.match(/^\d+/)[0];
      result.push([rowNumber, preText]);
    }
  });

  return result;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    let data = extractElements();
    sendResponse({ data: data });
  }
});
