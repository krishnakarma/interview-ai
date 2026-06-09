const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer-core")
const chromium = require("@sparticuz/chromium")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// ── Required for Render (serverless-like environment) ──────────────────────────
// @sparticuz/chromium needs these set BEFORE launch
chromium.setHeadlessMode = true
chromium.setGraphicsMode = false

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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    console.log("🟡 Launching browser...")  // ADD
    const executablePath = await chromium.executablePath
    console.log("🟡 Chromium path:", executablePath)  // ADD

    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: chromium.headless,
        // Required for Render's read-only filesystem
        ignoreDefaultArgs: ["--disable-extensions"],
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
        printBackground: true
    })

    await browser.close()

    // puppeteer-core returns a Uint8Array — convert to Buffer so res.send() works correctly
    return Buffer.from(pdfBuffer)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("Complete self-contained HTML document for the resume")
    })

    const prompt = `You are an expert resume writer and HTML/CSS developer. Generate a professional, dense, one-page resume in HTML that fully fills an A4 page.

==========================
CANDIDATE DATA — SINGLE SOURCE OF TRUTH
==========================
Resume: ${resume}
Self Description: ${selfDescription}
Target Job Description: ${jobDescription}

==========================
HALLUCINATION RULES — HIGHEST PRIORITY
==========================
These rules override everything else. Breaking them makes the resume fraudulent.

FORBIDDEN — never do any of the following:
- Add a project not explicitly listed in the candidate's resume
- Add a skill, tool, or technology not mentioned in the candidate's resume
- Add work experience or internship not mentioned in the candidate's resume
- Invent metrics, numbers, or percentages not present in the candidate's resume
- Add achievements, certifications, or activities not in the candidate's resume
- Change project names, company names, dates, or tech stacks

ALLOWED — you may do the following:
- Reword existing bullet points to be more descriptive and impactful
- Reorder or group existing skills into labeled rows
- Bold important keywords within existing bullet text
- Tailor wording of existing content to match job description keywords
- Add a Professional Summary using ONLY facts already present in the resume

==========================
PAGE DENSITY — FILL THE FULL PAGE
==========================
Target: entire 794px × 1123px A4 page must be filled. No white space at bottom.

Fill space using ONLY these techniques in order:
1. Use font-size: 12px for body text
2. Use line-height: 1.5
3. Use section margin-top: 14px
4. Use li margin-bottom: 2px
5. Always add a Professional Summary (2-3 lines) using only facts from the resume
6. Make each bullet point more detailed and descriptive using only existing resume information
7. Add more skill rows by breaking existing skills into more specific categories
8. If still not full — increase line-height to 1.6 and section margin-top to 18px

DO NOT add fake content to fill space. Ever.

==========================
CSS — USE EXACTLY THIS
==========================
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.5;
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
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.contact {
  font-size: 10px;
  text-align: center;
  color: #222;
  margin-top: 3px;
}

.top-rule {
  border: none;
  border-top: 0.8px solid #000;
  margin: 4px 0;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 0.7px solid #000;
  margin-top: 14px;
  margin-bottom: 3px;
  padding-bottom: 1px;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.bold { font-weight: 700; }
.italic { font-style: italic; }
.small { font-size: 10.5px; }

ul {
  padding-left: 15px;
  margin: 2px 0;
}

li {
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 2px;
}

.skill-row {
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 2px;
}

.project-block {
  margin-bottom: 6px;
}

.tech-stack-line {
  font-size: 10.5px;
  font-style: italic;
  margin-bottom: 2px;
}

.summary-text {
  font-size: 12px;
  line-height: 1.5;
}

==========================
SECTIONS — EXACT ORDER
==========================

1. HEADER
   - Name: centered, bold, uppercase, 20px
   - Contact: one line — phone | email | linkedin | github | leetcode
   - <hr class="top-rule"> below

2. PROFESSIONAL SUMMARY (ALWAYS INCLUDE)
   - Always include for every candidate — student or experienced
   - Write 2-3 lines using ONLY facts from the resume
   - Cover: current status, main tech stack, notable achievement
   - Use class="summary-text"

3. EDUCATION
   - Institution bold LEFT + dates RIGHT (flex-row)
   - Degree LEFT + CGPA RIGHT (flex-row)
   - Coursework: one comma-separated line in 10.5px italic

4. EXPERIENCE (CONDITIONAL)
   - Include ONLY if candidate has actual internships or jobs in their resume
   - Skip entirely if no work experience mentioned
   - Format: Company bold LEFT + dates RIGHT, Role LEFT + location RIGHT
   - 2-3 bullets using only facts from the resume

5. TECHNICAL SKILLS
   - Rows: "Programming Languages:", "Frontend:", "Backend & DB:", "AI & Tools:", "Core Concepts:"
   - Each row: bold label + value on same line
   - Use only skills mentioned in the candidate's resume
   - Minimum 5 rows, aim for 6-7

6. PROJECTS
   - Include ONLY projects listed in candidate's resume — no extras, no invented ones
   - Each project block:
     Line 1 (flex-row): Bold project name LEFT, date RIGHT
     Line 2: italic tech stack line in 10.5px
     3-4 bullet points — detailed, one full line each, using only facts from resume
     Bold key technologies inline within bullets

7. ACHIEVEMENTS AND ACTIVITIES
   - Include only achievements present in candidate's resume
   - Minimum 2 bullets, maximum 4
   - Bold key numbers with <strong>

==========================
DENSITY CHECK — MANDATORY BEFORE OUTPUT
==========================
Mentally estimate your total height:
- Header: ~45px
- Summary: ~55px
- Education: ~40px
- Skills: ~90px
- Each project: ~115px (3 projects = ~345px)
- Achievements: ~60px
- Section titles + rules: ~15px × 6 = ~90px
- Total should be between 1050px and 1122px

If below 1050px:
→ Increase line-height to 1.6
→ Increase section margin-top to 18px
→ Expand bullet points with more detail from resume
→ Add more skill rows
NEVER add fake projects or fake achievements.

==========================
OUTPUT
==========================
Return ONLY valid JSON: { "html": "<complete html string>" }
HTML must start with <!DOCTYPE html> with all CSS inside <head><style>.
Resume must fill the entire page — no empty white space at bottom.
Tailor existing content wording to match job description keywords.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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