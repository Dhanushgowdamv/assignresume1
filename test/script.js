async function loadTemplate() {
  const res = await fetch('resume-template.html');
  return await res.text();
}

function fillTemplate(template, data) {
  for (let key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, data[key]);
  }
  return template;
}

async function generateResume() {
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    summary: document.getElementById('summary').value,
    experience: document.getElementById('experience').value,
    education: document.getElementById('education').value,
  };

  const template = await loadTemplate();
  const filledTemplate = fillTemplate(template, data);
  document.getElementById('resumePreview').innerHTML = filledTemplate;
}

function exportPDF() {
  const element = document.getElementById('resumePreview');
  html2pdf().from(element).save('resume.pdf');
}
