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

        let tableHtml = '<table><thead><tr><th>Column</th><th>Content</th></tr></thead><tbody>';
        data.forEach(row => {
          tableHtml += `<tr><td>${row[0]}</td><td class="pre-style" data-full="${row[1]}">${row[1]}</td></tr>`;
        });
        tableHtml += '</tbody></table>';
        output.innerHTML = tableHtml;
      }
    );
  });

  document.getElementById('copyButton').addEventListener('click', () => {
    const output = document.getElementById('output');
    const rows = output.querySelectorAll('td.pre-style');
    let copyText = '';
    rows.forEach(row => {
      const fullText = row.getAttribute('data-full');
      copyText += `${fullText}\n`;
    });
    navigator.clipboard.writeText(copyText.trim()).then(() => {
      alert('Copied to clipboard!');
    });
  });
});
