import { useState } from "react";

const faqs = [
  { q: "How do I access my course materials?", a: "Navigate to 'My Courses' from the sidebar, click on the course you're enrolled in, then click 'Continue' to access your modules and lessons." },
  { q: "How are CPD points calculated?", a: "CPD points are awarded upon course completion and verified event attendance. Each course specifies the number of CPD points available. Points are tracked automatically on your Certificates & CPD page." },
  { q: "Can I download my certificate?", a: "Yes. Go to 'Certificates & CPD' in the sidebar, find your certificate, and click the 'Download' button to save a PDF copy." },
  { q: "What if I miss a live session?", a: "All live sessions are recorded and made available in the course modules within 24 hours. However, attendance is mandatory — if you must miss a session, submit a request for absence to info@gogmi.org.gh." },
  { q: "How do I reset my password?", a: "Go to Settings → Security, enter your current password and your new password, then click 'Update password'. If you've forgotten your password, contact your administrator." },
  { q: "Who do I contact for technical issues?", a: "For LMS technical support, reach out to Enoch Nikoi at the GoGMI Programme Office, or email info@gogmi.org.gh." },
  { q: "How do I join a live Zoom session?", a: "Live session links are available in the Calendar page and will also be sent to your email before each session. Click the link at the scheduled time to join." },
  { q: "Can I access courses on my mobile device?", a: "Yes. The GoGMI Learning Platform is accessible via any modern web browser on your phone or tablet. For the best experience, use a laptop or desktop with a stable internet connection." },
];

export default function HelpPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Help Centre</h1>
        <p className="text-[14px] text-gray-500">Find answers to common questions about the GoGMI Learning Platform.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 w-full max-w-xl">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for help..." className="border-none outline-none bg-transparent text-[14px] text-gray-700 w-full placeholder:text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        {/* FAQs */}
        <div>
          <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {filtered.length > 0 ? filtered.map((faq, i) => (
              <div key={i} className={`${i > 0 ? "border-t border-gray-100" : ""}`}>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[14px] font-medium text-gray-800 pr-4">{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 shrink-0 transition-transform ${expanded === i ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {expanded === i && (
                  <div className="px-5 pb-4">
                    <p className="text-[13.5px] text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            )) : (
              <div className="px-5 py-8 text-center">
                <p className="text-[14px] text-gray-500">No results found for "{search}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-3">Contact Support</h3>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-1">Email</div>
                <a href="mailto:info@gogmi.org.gh" className="text-[13.5px] text-brand-teal hover:underline">info@gogmi.org.gh</a>
              </div>
              <div>
                <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                <span className="text-[13.5px] text-gray-700">+233 54 640 8096</span>
              </div>
              <div>
                <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-1">Office</div>
                <span className="text-[13.5px] text-gray-700">14 Avenue, Osu Extension, Cantonments, Accra</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-3">LMS Support</h3>
            <p className="text-[13px] text-gray-500 mb-3">For technical issues with the learning platform, contact the LMS administrator.</p>
            <div>
              <div className="text-[13.5px] font-medium text-gray-700">Enoch Nikoi</div>
              <div className="text-[12.5px] text-gray-500">GoGMI Programme Office</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-[14px] font-semibold text-gray-800 mb-3">System Requirements</h3>
            <div className="flex flex-col gap-2">
              {[
                "Reliable internet (min. 100 Mbps recommended)",
                "Computer, laptop, or tablet with audio/video",
                "Modern web browser (Chrome, Firefox, Safari, Edge)",
                "Zoom for live sessions",
              ].map((req, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-teal shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span className="text-[13px] text-gray-600">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}