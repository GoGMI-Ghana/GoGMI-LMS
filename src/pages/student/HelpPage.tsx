export default function HelpPage() {
  const faqs = [
    { q: "How do I enroll in a course?", a: "Go to Course Catalog, select a course, and click 'Enroll in Course'. You'll need your course certificate ID from your GoGMI payment confirmation." },
    { q: "How do I join a live session?", a: "Once enrolled, go to your course page and click the blue 'Join Zoom Meeting' button. You'll find the Meeting ID and Passcode there as well." },
    { q: "Where do I find course materials?", a: "Go to Dashboard → click on your enrolled course → you'll see all modules and sessions. Click on any session to view videos or download documents uploaded by facilitators." },
    { q: "How do I submit an assessment?", a: "Go to Assessments in the sidebar. You'll see upcoming assignments and quizzes. Click on one to view details and submit your work." },
    { q: "How do I change my password?", a: "Go to Settings → Change Password. Enter your current password and your new password." },
    { q: "I forgot my password, what do I do?", a: "On the login page, click 'Forgot password?' and enter your email. You'll receive a reset link." },
    { q: "How do I get my certificate?", a: "Certificates are issued upon course completion. You can view and download them from the Certificates & CPD page." },
    { q: "Who do I contact for help?", a: "Email us at info@gogmi.org.gh or reach out to the GoGMI Programmes team." },
  ];

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Help Centre</h1><p className="text-[14px] text-gray-500">Frequently asked questions and support.</p></div>

      <div className="flex flex-col gap-3 mb-8">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
            <summary className="px-5 py-4 text-[14px] font-medium text-gray-800 cursor-pointer hover:bg-gray-50 transition-colors list-none flex items-center justify-between">
              {faq.q}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 shrink-0 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9" /></svg>
            </summary>
            <div className="px-5 pb-4"><p className="text-[13px] text-gray-600 leading-relaxed">{faq.a}</p></div>
          </details>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Still need help?</h2>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-4">Contact the GoGMI team for assistance with your course or technical issues.</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-teal"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><a href="mailto:info@gogmi.org.gh" className="text-[13px] text-brand-teal hover:underline">info@gogmi.org.gh</a></div>
          <div className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-teal"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span className="text-[13px] text-gray-600">Gulf of Guinea Maritime Institute, Accra, Ghana</span></div>
          <div className="flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-teal"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><a href="https://gogmi.org.gh" target="_blank" rel="noopener noreferrer" className="text-[13px] text-brand-teal hover:underline">gogmi.org.gh</a></div>
        </div>
      </div>
    </div>
  );
}