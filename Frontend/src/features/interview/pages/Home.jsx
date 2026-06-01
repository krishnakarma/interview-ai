// import React, { useState, useRef } from "react";
// import "../style/home.scss";
// import { useInterview } from "../hooks/useInterview.js";
// import { useNavigate } from "react-router";

// const Home = () => {
//   const { loading, generateReport, reports } = useInterview();
//   const [jobDescription, setJobDescription] = useState("");
//   const [selfDescription, setSelfDescription] = useState("");
//   const resumeInputRef = useRef();
//   const [selectedFile, setSelectedFile] = useState(null);

//   const navigate = useNavigate();

//   const handleGenerateReport = async () => {
//     const resumeFile = resumeInputRef.current.files[0];
//     const data = await generateReport({
//       jobDescription,
//       selfDescription,
//       resumeFile,
//     });
//     navigate(`/interview/${data._id}`);
//   };

//   if (loading) {
//     return (
//       <main className="loading-screen">
//         <h1>Loading your interview plan...</h1>
//       </main>
//     );
//   }

//   return (
//     <div className="home-page">
//       {/* Page Header */}
//       <header className="page-header">
//         <h1>
//           Create Your Custom <span className="highlight">Interview Plan</span>
//         </h1>
//         <p>
//           Let our AI analyze the job requirements and your unique profile to
//           build a winning strategy.
//         </p>
//       </header>

//       {/* Main Card */}
//       <div className="interview-card">
//         <div className="interview-card__body">
//           {/* Left Panel - Job Description */}
//           <div className="panel panel--left">
//             <div className="panel__header">
//               <span className="panel__icon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
//                   <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//                 </svg>
//               </span>
//               <h2>Target Job Description</h2>
//               <span className="badge badge--required">Required</span>
//             </div>
//             <textarea
//               onChange={(e) => {
//                 setJobDescription(e.target.value);
//               }}
//               className="panel__textarea"
//               placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
//               maxLength={5000}
//             />
//             <div className="char-counter">0 / 5000 chars</div>
//           </div>

//           {/* Vertical Divider */}
//           <div className="panel-divider" />

//           {/* Right Panel - Profile */}
//           <div className="panel panel--right">
//             <div className="panel__header">
//               <span className="panel__icon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="18"
//                   height="18"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                   <circle cx="12" cy="7" r="4" />
//                 </svg>
//               </span>
//               <h2>Your Profile</h2>
//             </div>

//             {/* Upload Resume */}
//             <div className="upload-section">
//               <label className="section-label">
//                 Upload Resume
//                 <span className="badge badge--best">Best Results</span>
//               </label>
//               <label className="dropzone" htmlFor="resume">
//                 <span className="dropzone__icon">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="28"
//                     height="28"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="16 16 12 12 8 16" />
//                     <line x1="12" y1="12" x2="12" y2="21" />
//                     <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
//                   </svg>
//                 </span>
//                 {selectedFile ? (
//                   <>
//                     <p className="dropzone__title success">
//                       ✅ {selectedFile.name}
//                     </p>

//                     <p className="dropzone__subtitle">
//                       File uploaded successfully
//                     </p>
//                   </>
//                 ) : (
//                   <>
//                     <p className="dropzone__title">
//                       Click to upload or drag & drop
//                     </p>

//                     <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
//                   </>
//                 )}
//                 <input
//                   ref={resumeInputRef}
//                   hidden
//                   type="file"
//                   id="resume"
//                   name="resume"
//                   accept=".pdf,.docx"
//                   onChange={(e) => {
//                     setSelectedFile(e.target.files[0]);
//                   }}
//                 />
//               </label>
//             </div>

//             {/* OR Divider */}
//             <div className="or-divider">
//               <span>OR</span>
//             </div>

//             {/* Quick Self-Description */}
//             <div className="self-description">
//               <label className="section-label" htmlFor="selfDescription">
//                 Quick Self-Description
//               </label>
//               <textarea
//                 onChange={(e) => {
//                   setSelfDescription(e.target.value);
//                 }}
//                 id="selfDescription"
//                 name="selfDescription"
//                 className="panel__textarea panel__textarea--short"
//                 placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
//               />
//             </div>

//             {/* Info Box */}
//             <div className="info-box">
//               <span className="info-box__icon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <circle cx="12" cy="12" r="10" />
//                   <line
//                     x1="12"
//                     y1="8"
//                     x2="12"
//                     y2="12"
//                     stroke="#1a1f27"
//                     strokeWidth="2"
//                   />
//                   <line
//                     x1="12"
//                     y1="16"
//                     x2="12.01"
//                     y2="16"
//                     stroke="#1a1f27"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </span>
//               <p>
//                 Either a <strong>Resume</strong> or a{" "}
//                 <strong>Self Description</strong> is required to generate a
//                 personalized plan.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Card Footer */}
//         <div className="interview-card__footer">
//           <span className="footer-info">
//             AI-Powered Strategy Generation &bull; Approx 30s
//           </span>
//           <button onClick={handleGenerateReport} className="generate-btn">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
//             </svg>
//             Generate My Interview Strategy
//           </button>
//         </div>
//       </div>

//       {/* Recent Reports List */}
//       {reports.length > 0 && (
//         <section className="recent-reports">
//           <h2>My Recent Interview Plans</h2>
//           <ul className="reports-list">
//             {reports.map((report) => (
//               <li
//                 key={report._id}
//                 className="report-item"
//                 onClick={() => navigate(`/interview/${report._id}`)}
//               >
//                 <h3>{report.title || "Untitled Position"}</h3>
//                 <p className="report-meta">
//                   Generated on {new Date(report.createdAt).toLocaleDateString()}
//                 </p>
//                 <p
//                   className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
//                 >
//                   Match Score: {report.matchScore}%
//                 </p>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* Page Footer */}
//       <footer className="page-footer">
//         <a href="#">Privacy Policy</a>
//         <a href="#">Terms of Service</a>
//         <a href="#">Help Center</a>
//       </footer>
//     </div>
//   );
// };

// export default Home;







import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview.js'
import { useToast } from '../../../components/Toast'
import Topbar from '../../../components/Topbar'
import LoadingScreen from '../../../components/LoadingScreen'
import '../style/home.scss'

// ── Auth context — adjust import path if different ────────────────────────────
import { useContext } from 'react'
import { AuthContext } from '../../auth/auth.context.jsx'

const Home = () => {
  const { loading, generateReport, reports } = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const resumeInputRef = useRef()
  const navigate = useNavigate()
  const toast = useToast()

  // Auth for logout — fallback if context shape differs
  const authCtx = useContext(AuthContext)
  const handleLogout = () => {
    if (authCtx?.logout) authCtx.logout()
    else navigate('/login')
  }

  const handleGenerateReport = async () => {
    if (!jobDescription.trim()) {
      // inline validation — no error toast per requirements
      return
    }
    if (!selectedFile && !selfDescription.trim()) {
      return
    }

    const resumeFile = resumeInputRef.current?.files[0]
    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile })
      toast.success('Your interview plan is ready!')
      navigate(`/interview/${data._id}`)
    } catch {
      // silent — no error popup per requirements
    }
  }

  if (loading) {
    return <LoadingScreen message="Crafting your interview plan" />
  }

  const charCount = jobDescription.length

  return (
    <div className="home-page">
      <Topbar onLogout={handleLogout} />

      <main className="home-main">
        {/* Header */}
        <header className="home-header">
          <h1>
            Create Your Custom{' '}
            <span className="highlight">Interview Plan</span>
          </h1>
          <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
        </header>

        {/* Main card */}
        <div className="icard">
          <div className="icard__body">

            {/* ── Left: Job Description ── */}
            <div className="ipanel ipanel--left">
              <div className="ipanel__header">
                <span className="ipanel__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </span>
                <h2>Target Job Description</h2>
                <span className="badge badge--required">Required</span>
              </div>
              <div className="ipanel__textarea-wrap">
                <textarea
                  className="ipanel__textarea"
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                  maxLength={5000}
                  aria-label="Job description"
                />
                <div className={`char-counter ${charCount > 4500 ? 'char-counter--warn' : ''}`}>
                  {charCount} / 5000
                </div>
              </div>
            </div>

            <div className="ipanel-divider" aria-hidden="true" />

            {/* ── Right: Profile ── */}
            <div className="ipanel ipanel--right">
              <div className="ipanel__header">
                <span className="ipanel__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <h2>Your Profile</h2>
              </div>

              {/* Upload resume */}
              <div className="upload-section">
                <label className="section-label">
                  Upload Resume
                  <span className="badge badge--best">Best Results</span>
                </label>
                <label className={`dropzone ${selectedFile ? 'dropzone--filled' : ''}`} htmlFor="resume">
                  <span className="dropzone__icon" aria-hidden="true">
                    {selectedFile ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                      </svg>
                    )}
                  </span>
                  {selectedFile ? (
                    <>
                      <p className="dropzone__title dropzone__title--success">{selectedFile.name}</p>
                      <p className="dropzone__subtitle">File ready · click to change</p>
                    </>
                  ) : (
                    <>
                      <p className="dropzone__title">Click to upload or drag & drop</p>
                      <p className="dropzone__subtitle">PDF or DOCX · Max 5 MB</p>
                    </>
                  )}
                  <input
                    ref={resumeInputRef}
                    hidden
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.docx"
                    onChange={e => setSelectedFile(e.target.files[0] || null)}
                  />
                </label>
              </div>

              {/* OR */}
              <div className="or-divider"><span>OR</span></div>

              {/* Self description */}
              <div className="self-desc">
                <label className="section-label" htmlFor="selfDescription">
                  Quick Self-Description
                </label>
                <textarea
                  id="selfDescription"
                  className="ipanel__textarea ipanel__textarea--short"
                  value={selfDescription}
                  onChange={e => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy…"
                  aria-label="Self description"
                />
              </div>

              {/* Info hint */}
              <div className="info-hint">
                <span className="info-hint__icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </span>
                <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="icard__footer">
            <span className="icard__footer-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              AI-Powered · Approx 30s
            </span>
            <button
              className="generate-btn"
              onClick={handleGenerateReport}
              disabled={!jobDescription.trim() || (!selectedFile && !selfDescription.trim())}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
              Generate My Interview Strategy
            </button>
          </div>
        </div>

        {/* Recent reports */}
        {reports.length > 0 && (
          <section className="recent-plans">
            <h2 className="recent-plans__title">My Recent Interview Plans</h2>
            <ul className="plans-grid">
              {reports.map(report => (
                <li
                  key={report._id}
                  className="plan-card"
                  onClick={() => navigate(`/interview/${report._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/interview/${report._id}`)}
                >
                  <div className="plan-card__arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                  <h3>{report.title || 'Untitled Position'}</h3>
                  <p className="plan-card__meta">
                    Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <span className={`plan-card__score score--${report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'}`}>
                    Match Score: {report.matchScore}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="home-footer">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </footer>
      </main>
    </div>
  )
}

export default Home
