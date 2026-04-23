import { useState } from "react";

const conversations = [
  { id: "c1", name: "Prof. Jeffrey Landsman", role: "Facilitator — Maritime Governance", lastMessage: "I've shared the additional reading materials for Module 3.", time: "10 min ago", unread: true },
  { id: "c2", name: "Group 2 — Case Study", role: "Maritime Governance", lastMessage: "Fatima: Let's meet tomorrow at 2pm to coordinate our report sections.", time: "1 hour ago", unread: true },
  { id: "c3", name: "Lawrence Dogli", role: "Programmes Manager, GoGMI", lastMessage: "Your absence request for May 14th has been noted. Thank you.", time: "3 hours ago", unread: true },
  { id: "c4", name: "Akua Konadu", role: "Fellow Participant", lastMessage: "Did you get the SWOT template? I can share mine.", time: "Yesterday", unread: false },
  { id: "c5", name: "GoGMI Admin", role: "System", lastMessage: "Reminder: Your CPD evidence for Q1 2026 is due by March 31st.", time: "2 days ago", unread: false },
  { id: "c6", name: "Enoch Nikoi", role: "LMS Support, GoGMI", lastMessage: "Your LMS access has been set up. Let me know if you need help navigating.", time: "4 days ago", unread: false },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState<string | null>("c1");

  const selectedConv = conversations.find(c => c.id === selected);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Messages</h1>
        <p className="text-[14px] text-gray-500">Direct messages with facilitators and peers.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden grid grid-cols-[340px_1fr]" style={{ height: "calc(100vh - 220px)" }}>
        {/* Conversation list */}
        <div className="border-r border-gray-200 overflow-y-auto">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => setSelected(conv.id)}
              className={`px-4 py-3.5 cursor-pointer border-b border-gray-100 transition-colors ${selected === conv.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
                  {conv.name.split(" ").filter(n => n.length > 1 && !n.includes("—")).map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[13.5px] truncate ${conv.unread ? "font-semibold text-gray-800" : "font-medium text-gray-700"}`}>{conv.name}</span>
                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className={`text-[12.5px] truncate mt-0.5 ${conv.unread ? "text-gray-700" : "text-gray-500"}`}>{conv.lastMessage}</p>
                </div>
                {conv.unread && <div className="w-2 h-2 rounded-full bg-brand-teal shrink-0" />}
              </div>
            </div>
          ))}
        </div>

        {/* Message view */}
        <div className="flex flex-col">
          {selectedConv ? (
            <>
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="text-[15px] font-semibold text-gray-800">{selectedConv.name}</h3>
                <p className="text-[12px] text-gray-500">{selectedConv.role}</p>
              </div>
              <div className="flex-1 p-5 flex flex-col justify-end">
                <div className="bg-gray-50 rounded-lg p-4 max-w-md">
                  <p className="text-[13.5px] text-gray-700">{selectedConv.lastMessage}</p>
                  <span className="text-[11px] text-gray-400 mt-1.5 block">{selectedConv.time}</span>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-brand-teal transition-colors"
                  />
                  <button className="bg-brand-navy text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors shrink-0">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[14px] text-gray-400">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}