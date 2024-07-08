document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: () => {
          return new Promise((resolve) => {
            chrome.runtime.sendMessage({ action: 'extract' }, (response) => {
              resolve(response.data);
            });
          });
        }
      },
      (results) => {
        if (chrome.runtime.lastError || !results || !results[0].result) {
          console.error(chrome.runtime.lastError);
          return;
        }
        const data = results[0].result;
        const output = document.getElementById('output');
        output.textContent = data.map(row => `${row[0]}\t${row[1]}`).join('\n');
      }
    );
  });

  document.getElementById('copyButton').addEventListener('click', () => {
    const output = document.getElementById('output');
    navigator.clipboard.writeText(output.textContent).then(() => {
      alert('Copied to clipboard!');
    });
  });
});
