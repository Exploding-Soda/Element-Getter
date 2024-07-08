function extractElements() {
  let elements = document.querySelectorAll('.alert.alert-success.dismiss');
  let result = [];

  elements.forEach(element => {
    let strongText = element.querySelector('strong').innerText;
    let preElement = element.nextElementSibling;

    if (preElement && preElement.classList.contains('prestyle')) {
      let preText = preElement.innerText.trim().replace(/\n/g, '\\n');
      let rowNumber = parseInt(strongText.match(/^\d+/)[0], 10);
      result.push([rowNumber, preText]);
    }
  });

  result.sort((a, b) => a[0] - b[0]); // 按列号排序
  return result;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    let data = extractElements();
    sendResponse({ data: data });
  }
});
