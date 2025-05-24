 // Section switching
    function switchSection(sectionId) {
      const sections = ['builder', 'samples', 'roadmaps'];
      sections.forEach(id => {
        const el = id === 'builder' ? document.querySelector('.main-container') : document.getElementById(id);
        if (id === sectionId) {
          el.style.display = 'flex';
          if(id === 'builder') el.style.flexDirection = 'row';
          else el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });
    }
    switchSection('builder'); // Show resume builder by default

    // DOM Elements
    const form = document.getElementById('resumeForm');
    const preview = document.getElementById('resumePreview');

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

      if(!name || !email || !phone || !college || !summary || !skills) {
        preview.innerHTML = "<p>Please fill in all required fields to see the preview.</p>";
        return;
      }

      // Split and clean skills and projects
      const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
      const linksArr = projectLinks ? projectLinks.split(',').map(s => s.trim()).filter(Boolean) : [];
      const descArr = projectDescriptions ? projectDescriptions.split('|||').map(s => s.trim()).filter(Boolean) : [];

      let projectsHTML = '';
      if (linksArr.length && descArr.length) {
        projectsHTML = '<h3>Projects</h3><ul>';
        for (let i = 0; i < Math.min(linksArr.length, descArr.length); i++) {
          projectsHTML += `<li><a href="${linksArr[i]}" target="_blank" rel="noopener">${linksArr[i]}</a>: ${descArr[i]}</li>`;
        }
        projectsHTML += '</ul>';
      } else if (linksArr.length) {
        projectsHTML = '<h3>Project Links</h3><ul>' + linksArr.map(link => `<li><a href="${link}" target="_blank" rel="noopener">${link}</a></li>`).join('') + '</ul>';
      } else if (descArr.length) {
        projectsHTML = '<h3>Project Descriptions</h3><ul>' + descArr.map(desc => `<li>${desc}</li>`).join('') + '</ul>';
      }

      preview.innerHTML = `
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

    // Generate preview on input events
    form.addEventListener('input', generatePreview);

    // Also generate on page load if any saved data
    window.addEventListener('load', () => {
      generatePreview();
    });

    // On form submit: prevent reload and update preview
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      generatePreview();
      alert('Resume preview updated!');
    });

    // Clear preview on form reset
    form.addEventListener('reset', () => {
      preview.innerHTML = '';
    });

    // Save form data to localStorage
    function saveToLocalStorage() {
      const formData = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        college: form.college.value,
        summary: form.summary.value,
        skills: form.skills.value,
        projectLinks: form.projectLinks.value,
        projectDescriptions: form.projectDescriptions.value,
      };
      localStorage.setItem('resumeFormData', JSON.stringify(formData));
      alert('Form data saved locally.');
    }

    // Load form data from localStorage
    function loadFromLocalStorage() {
      const savedData = localStorage.getItem('resumeFormData');
      if (!savedData) {
        alert('No saved data found.');
        return;
      }
      const formData = JSON.parse(savedData);
      form.name.value = formData.name || '';
      form.email.value = formData.email || '';
      form.phone.value = formData.phone || '';
      form.college.value = formData.college || '';
      form.summary.value = formData.summary || '';
      form.skills.value = formData.skills || '';
      form.projectLinks.value = formData.projectLinks || '';
      form.projectDescriptions.value = formData.projectDescriptions || '';
      generatePreview();
      alert('Form data loaded.');
    }

    // Export resume preview as PDF using html2canvas and jsPDF
    async function exportPDF() {
      if (!preview.innerHTML.trim()) {
        alert('Please generate your resume first.');
        return;
      }

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'pt', 'a4');

      // Use html2canvas to capture the preview element
      try {
        const canvas = await html2canvas(preview, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#fff',
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculate image dimensions to fit A4 size
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resume.pdf');
      } catch (error) {
        alert('Failed to export PDF. Try again.');
        console.error(error);
      }
    }
 
