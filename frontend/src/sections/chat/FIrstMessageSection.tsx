import useUserStore from '../../store/userStore';

interface FirstMessageProps {
  setInput: (val: string) => void;
}

const FIrstMessageSection = ({ setInput }: FirstMessageProps) => {
  const user = useUserStore(state => state.user)
  const suggestions = [
    { label: "Property Dispute", desc: "Ask about land ownership issues", query: "Tell me about Property Disputes" },
    { label: "Business Registration", desc: "Learn about registration process", query: "How do I register a business?" },
    { label: "Labor Rights", desc: "Employee rights and regulations", query: "What are my labor rights?" },
    { label: "Legal Documents", desc: "Help with legal documentation", query: "How do I draft legal documents?" },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-text2">
          Hello <span className="text-primary">{user?.name}</span>,
        </h1>
        <p className="text-black text-xl md:text-2xl">What do you want to know today?</p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        {suggestions.map((item, index) => (
          <button
            key={index}
            className="bg-black/10 hover:bg-black/20 transition p-4 rounded-xl text-left border border-black/20"
            onClick={() => setInput(item.query)}
          >
            <p className="text-black font-medium">{item.label}</p>
            <p className="text-sm text-text2 mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FIrstMessageSection