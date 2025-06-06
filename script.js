// DOM Elements
const form = document.getElementById('resumeForm');
const preview = document.getElementById('resumePreview');
const photoInput = document.getElementById('photoUpload');
let uploadedPhotoDataURL = "";

// Image upload and preview setup
photoInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (event) {
      uploadedPhotoDataURL = event.target.result;
      generatePreview(); // Refresh preview with the image
    };
    reader.readAsDataURL(file);
  }
});

// Generate Resume Preview on form input
function generatePreview() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const college = form.college.value.trim();
  const summary = form.summary.value.trim();
  const skills = form.skills.value.trim();
  const projectLinks = form.projectLinks.value.trim();
  const projectDescriptions = form.projectDescriptions.value.trim();

  if (!name || !email || !phone || !college || !summary || !skills) {
    preview.innerHTML = "<p>Please fill in all required fields to see the preview.</p>";
    return;
  }

  const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
  const linksArr = projectLinks ? projectLinks.split(',').map(s => s.trim()).filter(Boolean) : [];
  const descArr = projectDescriptions ? projectDescriptions.split('|||').map(s => s.trim()).filter(Boolean) : [];

  let projectsHTML = '';
  if (linksArr.length && descArr.length) {
    projectsHTML = '<h3>Projects</h3><ul>';
    for (let i = 0; i < Math.min(linksArr.length, descArr.length); i++) {
      projectsHTML += `<li><a href="${linksArr[i]}" target="_blank">${linksArr[i]}</a>: ${descArr[i]}</li>`;
    }
    projectsHTML += '</ul>';
  } else if (linksArr.length) {
    projectsHTML = '<h3>Project Links</h3><ul>' + linksArr.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('') + '</ul>';
  } else if (descArr.length) {
    projectsHTML = '<h3>Project Descriptions</h3><ul>' + descArr.map(desc => `<li>${desc}</li>`).join('') + '</ul>';
  }

  // Inject photo if available
  const photoHTML = uploadedPhotoDataURL
    ? `<div class="profile-pic"><img src="${uploadedPhotoDataURL}" alt="Profile Photo" style="width:100px; height:100px; object-fit:cover; border-radius: 50%;" /></div>`
    : '';

  preview.innerHTML = `
    ${photoHTML}
    <h2>${name}</h2>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
    <p><strong>College/University:</strong> ${college}</p>
    <h3>Professional Summary</h3>
    <p>${summary}</p>
    <h3>Skills</h3>
    <ul>${skillsArr.map(skill => `<li>${skill}</li>`).join('')}</ul>
    ${projectsHTML}
  `;
}

// Export resume as PDF
async function exportPDF() {
  const resumeSection = document.getElementById('resumePreview');
  const canvas = await html2canvas(resumeSection, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save('resume.pdf');
}

// Phone number validation
form.phone.addEventListener('input', () => {
  form.phone.value = form.phone.value.replace(/\D/g, '');
  form.phone.setCustomValidity(form.phone.value.length !== 10 ? 'Phone number must be exactly 10 digits.' : '');
});

// Prevent form submit if phone invalid
form.addEventListener('submit', (e) => {
  if (form.phone.value.length !== 10) {
    e.preventDefault();
    form.phone.setCustomValidity('Phone number must be exactly 10 digits.');
    form.reportValidity();
  } else {
    form.phone.setCustomValidity('');
  }
});

// Initial preview & event bindings
form.addEventListener('input', generatePreview);
form.addEventListener('reset', () => {
  preview.innerHTML = '';
  uploadedPhotoDataURL = '';
});
window.addEventListener('load', generatePreview);
