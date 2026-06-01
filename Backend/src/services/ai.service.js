
const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).describe("A day-wise preparation plan for the candidate"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "0mm",
            bottom: "0mm",
            left: "0mm",
            right: "0mm"
        },
        printBackground: true
    })

    await browser.close()
    return pdfBuffer
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("Complete self-contained HTML document for the resume")
    })

    const prompt = `You are an expert resume writer and HTML/CSS developer. Your job is to generate a resume in HTML that looks EXACTLY like a LaTeX-generated professional resume — dense, tight, fully filling one A4 page with no empty space at the bottom.

CANDIDATE DETAILS:
- Resume/Background: ${resume}
- Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

==========================
CRITICAL: PAGE DENSITY
==========================
The resume MUST visually fill the entire A4 page (794px × 1123px).
Look at this reference layout — every section is packed tightly:

HEADER (center-aligned, ~40px tall)
─────────────────────────────────── (rule)
EDUCATION (~35px)
─────────────────────────────────── (rule)
TECHNICAL SKILLS (~80px, 6-7 rows)
─────────────────────────────────── (rule)
PROJECTS (3 projects × ~120px each = ~360px)
─────────────────────────────────── (rule)
ACHIEVEMENTS (~60px, 3 bullets)
─────────────────────────────────── (rule)

Total ≈ 1100px. If your output is shorter than this, you have FAILED.
Do NOT leave whitespace at the bottom. Expand bullet points, add more detail, add more projects if needed.

If the candidate has WORK EXPERIENCE or INTERNSHIPS, insert an EXPERIENCE section between EDUCATION and TECHNICAL SKILLS:
- Company name bold left + date right (flex row)
- Role/title left + location right (flex row)
- 2-3 bullet points with metrics

If the candidate has no work experience, skip the EXPERIENCE section entirely.

PROFESSIONAL SUMMARY: Only include if the candidate has 1+ years of work experience. Skip for students/freshers.

==========================
EXACT CSS RULES
==========================
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  font-size: 10.5px;
  line-height: 1.35;
  color: #000;
  background: #fff;
}

.page {
  width: 794px;
  min-height: 1122px;
  padding: 38px 52px;
  box-sizing: border-box;
}

.name {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.contact {
  font-size: 9px;
  text-align: center;
  color: #222;
  margin-top: 3px;
}

.section-title {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 0.7px solid #000;
  margin-top: 7px;
  margin-bottom: 3px;
  padding-bottom: 1px;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

ul {
  padding-left: 14px;
  margin: 1px 0;
}

li {
  font-size: 10.5px;
  line-height: 1.35;
  margin-bottom: 1px;
}

.skill-row {
  margin-bottom: 1.5px;
  font-size: 10.5px;
  line-height: 1.35;
}

.project-block {
  margin-bottom: 4px;
}

.tech-stack {
  font-size: 10px;
  margin-bottom: 1px;
}

.top-rule {
  border: none;
  border-top: 0.8px solid #000;
  margin: 3px 0 4px 0;
}

==========================
SECTIONS — EXACT ORDER
==========================

1. HEADER
   - Full name: centered, bold, uppercase, 18px
   - One contact line: phone | email | linkedin | github | leetcode
   - <hr> below header

2. EDUCATION (always present)
   - Institution name bold LEFT + date RIGHT (flex-row)
   - Degree LEFT + CGPA RIGHT (flex-row)
   - Coursework: one comma-separated line, 10px font

3. EXPERIENCE (only if candidate has internships or jobs)
   - Each role: Company bold LEFT + dates RIGHT
   - Title LEFT + location RIGHT
   - 2-3 bullets with metrics

4. TECHNICAL SKILLS
   - Rows: "Programming Languages:", "Frontend:", "Backend & DB:", "AI & Tools:", "Core Concepts:"
   - Each row: bold label + value on same line
   - Minimum 5 rows, aim for 6-7

5. PROJECTS (takes most vertical space — most important)
   - Include ALL projects from candidate's resume, minimum 3
   - Each project:
     Line 1 (flex-row): "<Bold Project Name> | <Short Tech>" on left, date on right
     Line 2: "Tech Stack: full list" in 10px
     3-4 bullet points — each bullet should be a FULL LINE with concrete metric or outcome
     Do NOT write short 5-word bullets. Each bullet minimum 12 words.
   - 4px gap between projects

6. ACHIEVEMENTS AND ACTIVITIES
   - Minimum 3 bullets
   - Bold key numbers inline using <strong>
   - Each bullet should be a full descriptive line

==========================
ATS RULES
==========================
- Plain HTML + CSS only — no SVG, no images, no canvas, no external fonts
- All text must be selectable
- Standard uppercase section names
- Single column layout only
- Use <ul><li> for bullets

==========================
DENSITY CHECK — BEFORE YOU OUTPUT
==========================
Mentally calculate the height of your output:
- Header: ~42px
- Education: ~38px
- Skills: ~85px
- Each project: ~110-125px (3 projects = ~360px, 4 projects = ~480px)
- Achievements: ~55px
- Section titles + rules: ~15px each × 5 = ~75px
- Total should be between 1050px and 1122px

If your total is below 1050px:
→ Add a 4th project if candidate has one
→ Expand each bullet to be more descriptive
→ Add one more skill row
→ Add one more achievement bullet

==========================
OUTPUT FORMAT
==========================
Return ONLY valid JSON: { "html": "<complete html string>" }
The HTML must start with <!DOCTYPE html> and include all CSS inside a <style> tag in <head>.
The resume MUST fill the entire page — no empty white space at the bottom.
Tailor all content keywords to match the job description provided.`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }





// const { GoogleGenAI } = require("@google/genai")
// const { z } = require("zod")
// const { zodToJsonSchema } = require("zod-to-json-schema")
// const puppeteer = require("puppeteer")

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// })


// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The behavioral question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day"),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day")
//     })).describe("A day-wise preparation plan for the candidate"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

//     const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}
// `

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema),
//         }
//     })

//     return JSON.parse(response.text)
// }


// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch({
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     })
//     const page = await browser.newPage()
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" })

//     const pdfBuffer = await page.pdf({
//         format: "A4",
//         margin: {
//             top: "0mm",
//             bottom: "0mm",
//             left: "0mm",
//             right: "0mm"
//         },
//         printBackground: true
//     })

//     await browser.close()
//     return pdfBuffer
// }


// async function generateResumePdf({ resume, selfDescription, jobDescription }) {

//     const resumePdfSchema = z.object({
//         html: z.string().describe("Complete self-contained HTML document for the resume")
//     })

//     const prompt = `You are an expert resume writer and HTML/CSS developer. Generate a professional, dense, one-page resume in HTML that fully fills an A4 page.

// ==========================
// CANDIDATE DATA — SINGLE SOURCE OF TRUTH
// ==========================
// Resume: ${resume}
// Self Description: ${selfDescription}
// Target Job Description: ${jobDescription}

// ==========================
// HALLUCINATION RULES — HIGHEST PRIORITY
// ==========================
// These rules override everything else. Breaking them makes the resume fraudulent.

// FORBIDDEN — never do any of the following:
// - Add a project not explicitly listed in the candidate's resume
// - Add a skill, tool, or technology not mentioned in the candidate's resume
// - Add work experience or internship not mentioned in the candidate's resume  
// - Invent metrics, numbers, or percentages not present in the candidate's resume
// - Add achievements, certifications, or activities not in the candidate's resume
// - Change project names, company names, dates, or tech stacks
// - Add a Professional Summary unless the candidate has 1+ years of work experience

// ALLOWED — you may do the following:
// - Reword existing bullet points to be more descriptive and impactful
// - Reorder or group existing skills into labeled rows
// - Bold important keywords within existing bullet text
// - Tailor wording of existing content to match job description keywords
// - Add a Professional Summary ONLY if candidate has real work experience, using ONLY facts from the resume

// ==========================
// PAGE DENSITY — FILL THE FULL PAGE
// ==========================
// Target: entire 794px × 1123px A4 page must be filled. No white space at bottom.

// Fill space using ONLY these techniques in order:
// 1. font-size: 11px (not 10.5px)
// 2. line-height: 1.45
// 3. section margin-top: 10px
// 4. li margin-bottom: 2px
// 5. Add Professional Summary (2-3 lines) if candidate has work experience — using only resume facts
// 6. Make each bullet point more detailed and descriptive using only existing resume information
// 7. Add more skill rows by breaking existing skills into more specific categories

// DO NOT add fake content to fill space. Ever.

// ==========================
// CSS — USE EXACTLY THIS
// ==========================
// * { margin: 0; padding: 0; box-sizing: border-box; }

// body {
//   font-family: Arial, sans-serif;
//   font-size: 11px;
//   line-height: 1.45;
//   color: #000;
//   background: #fff;
// }

// .page {
//   width: 794px;
//   min-height: 1122px;
//   padding: 38px 52px;
//   box-sizing: border-box;
// }

// .name {
//   font-size: 18px;
//   font-weight: 700;
//   text-align: center;
//   letter-spacing: 1px;
//   text-transform: uppercase;
// }

// .contact {
//   font-size: 9.5px;
//   text-align: center;
//   color: #222;
//   margin-top: 3px;
// }

// .top-rule {
//   border: none;
//   border-top: 0.8px solid #000;
//   margin: 4px 0;
// }

// .section-title {
//   font-size: 11px;
//   font-weight: 700;
//   text-transform: uppercase;
//   border-bottom: 0.7px solid #000;
//   margin-top: 10px;
//   margin-bottom: 3px;
//   padding-bottom: 1px;
// }

// .flex-row {
//   display: flex;
//   justify-content: space-between;
//   align-items: baseline;
// }

// .bold { font-weight: 700; }
// .italic { font-style: italic; }
// .small { font-size: 10px; }

// ul {
//   padding-left: 15px;
//   margin: 2px 0;
// }

// li {
//   font-size: 11px;
//   line-height: 1.45;
//   margin-bottom: 2px;
// }

// .skill-row {
//   font-size: 11px;
//   line-height: 1.45;
//   margin-bottom: 2px;
// }

// .project-block {
//   margin-bottom: 5px;
// }

// .tech-stack-line {
//   font-size: 10px;
//   font-style: italic;
//   margin-bottom: 2px;
// }

// ==========================
// SECTIONS — EXACT ORDER
// ==========================

// 1. HEADER
//    - Name: centered, bold, uppercase, 18px
//    - Contact: one line — phone | email | linkedin | github | leetcode
//    - <hr class="top-rule"> below

// 2. PROFESSIONAL SUMMARY (CONDITIONAL)
//    - Include ONLY if candidate has 1+ years of real work experience
//    - Skip entirely for students and freshers
//    - 2-3 lines using only facts from the resume

// 3. EDUCATION
//    - Institution bold LEFT + dates RIGHT (flex-row)
//    - Degree LEFT + CGPA RIGHT (flex-row)
//    - Coursework: one comma-separated line in 10px italic

// 4. EXPERIENCE (CONDITIONAL)
//    - Include ONLY if candidate has actual internships or jobs in their resume
//    - Skip entirely if no work experience mentioned
//    - Format: Company bold LEFT + dates RIGHT, Role LEFT + location RIGHT
//    - 2-3 bullets using only facts from the resume

// 5. TECHNICAL SKILLS
//    - Rows: "Programming Languages:", "Frontend:", "Backend & DB:", "AI & Tools:", "Core Concepts:"
//    - Each row: bold label + value on same line
//    - Use only skills mentioned in the candidate's resume
//    - Minimum 5 rows

// 6. PROJECTS
//    - Include ONLY projects listed in candidate's resume — no extras
//    - Each project block:
//      Line 1 (flex-row): Bold project name LEFT, date RIGHT
//      Line 2: italic tech stack line in 10px
//      3-4 bullet points — detailed, one full line each, using only facts from resume
//      Bold key technologies inline within bullets

// 7. ACHIEVEMENTS AND ACTIVITIES
//    - Include only achievements present in candidate's resume
//    - Minimum 2 bullets, maximum 4
//    - Bold key numbers with <strong>

// ==========================
// OUTPUT
// ==========================
// Return ONLY valid JSON: { "html": "<complete html string>" }
// HTML must start with <!DOCTYPE html> with all CSS in <head><style>.
// Resume must fill the full page using font size, line height, and spacing — never fake content.
// Tailor existing content wording to match job description keywords.`

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(resumePdfSchema),
//         }
//     })

//     const jsonContent = JSON.parse(response.text)
//     const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
//     return pdfBuffer
// }

// module.exports = { generateInterviewReport, generateResumePdf }



