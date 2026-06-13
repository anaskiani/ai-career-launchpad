import { jsPDF } from 'jspdf';

/**
 * Generate ATS-friendly PDF from resume data
 */
export const generateResumePDF = (form) => {
  const { personalInfo = {}, experiences = [], education = [], skills = [], projects = [], certifications = [] } = form;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const colors = {
    black: [26, 26, 26],
    dark: [55, 55, 55],
    gray: [100, 100, 100],
    light: [160, 160, 160],
    line: [200, 200, 200],
  };

  // Helper: add text with word wrap, returns new Y
  const addText = (text, x, yPos, { fontSize = 9, color = colors.dark, bold = false, maxWidth = contentWidth, lineHeight = 4.5 } = {}) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      if (yPos > 280) { doc.addPage(); yPos = 18; }
      doc.text(line, x, yPos);
      yPos += lineHeight;
    });
    return yPos;
  };

  // Helper: section heading
  const addSectionHeading = (title) => {
    if (y > 270) { doc.addPage(); y = 18; }
    y += 3;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.black);
    doc.text(title.toUpperCase(), margin, y);
    y += 1.5;
    doc.setDrawColor(...colors.line);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
  };

  // === HEADER ===
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.black);
  doc.text(personalInfo.fullName || 'Your Name', margin, y);
  y += 7;

  // Contact line
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (contactParts.length > 0) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray);
    doc.text(contactParts.join('  |  '), margin, y);
    y += 4.5;
  }

  // Links line
  const linkParts = [];
  if (personalInfo.linkedin) linkParts.push(`LinkedIn: ${personalInfo.linkedin}`);
  if (personalInfo.github) linkParts.push(`GitHub: ${personalInfo.github}`);
  if (linkParts.length > 0) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray);
    doc.text(linkParts.join('  |  '), margin, y);
    y += 4;
  }

  // Divider
  doc.setDrawColor(...colors.black);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // === SUMMARY ===
  if (personalInfo.summary) {
    addSectionHeading('Professional Summary');
    y = addText(personalInfo.summary, margin, y, { fontSize: 9, color: colors.dark });
    y += 1;
  }

  // === EXPERIENCE ===
  if (experiences.length > 0) {
    addSectionHeading('Experience');
    experiences.forEach((exp) => {
      if (y > 270) { doc.addPage(); y = 18; }
      // Position — Company on left, dates on right
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(`${exp.position || ''} — ${exp.company || ''}`, margin, y);

      const dateStr = `${formatDatePDF(exp.startDate)} – ${exp.currentlyWorking ? 'Present' : formatDatePDF(exp.endDate)}`;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.gray);
      const dateWidth = doc.getTextWidth(dateStr);
      doc.text(dateStr, pageWidth - margin - dateWidth, y);
      y += 4.5;

      if (exp.description) {
        y = addText(exp.description, margin, y, { fontSize: 8.5, color: colors.dark });
      }
      y += 2;
    });
  }

  // === EDUCATION ===
  if (education.length > 0) {
    addSectionHeading('Education');
    education.forEach((edu) => {
      if (y > 275) { doc.addPage(); y = 18; }
      const title = `${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''} — ${edu.institution || ''}`;
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(title, margin, y);

      if (edu.graduationDate) {
        const gDate = formatDatePDF(edu.graduationDate);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray);
        const w = doc.getTextWidth(gDate);
        doc.text(gDate, pageWidth - margin - w, y);
      }
      y += 4.5;

      if (edu.gpa) {
        y = addText(`GPA: ${edu.gpa}`, margin, y, { fontSize: 8.5, color: colors.gray });
      }
      y += 1.5;
    });
  }

  // === SKILLS ===
  if (skills.length > 0) {
    addSectionHeading('Skills');
    const skillStr = skills.map((s) => s.name).join('  •  ');
    y = addText(skillStr, margin, y, { fontSize: 9, color: colors.dark });
    y += 1;
  }

  // === PROJECTS ===
  if (projects.length > 0) {
    addSectionHeading('Projects');
    projects.forEach((proj) => {
      if (y > 270) { doc.addPage(); y = 18; }
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(proj.title || '', margin, y);

      if (proj.url) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(59, 130, 246);
        const w = doc.getTextWidth(proj.url);
        doc.text(proj.url, pageWidth - margin - w, y);
      }
      y += 4.5;

      if (proj.description) {
        y = addText(proj.description, margin, y, { fontSize: 8.5, color: colors.dark });
      }
      if (proj.technologies?.length > 0) {
        y = addText(`Technologies: ${proj.technologies.join(', ')}`, margin, y, { fontSize: 8, color: colors.gray });
      }
      y += 2;
    });
  }

  // === CERTIFICATIONS ===
  if (certifications.length > 0) {
    addSectionHeading('Certifications');
    certifications.forEach((cert) => {
      if (y > 275) { doc.addPage(); y = 18; }
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.black);
      doc.text(`${cert.title || ''}${cert.issuer ? ` — ${cert.issuer}` : ''}`, margin, y);

      if (cert.issueDate) {
        const d = formatDatePDF(cert.issueDate);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray);
        const w = doc.getTextWidth(d);
        doc.text(d, pageWidth - margin - w, y);
      }
      y += 5;
    });
  }

  // Save
  const fileName = `${(personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
  doc.save(fileName);
};

function formatDatePDF(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
