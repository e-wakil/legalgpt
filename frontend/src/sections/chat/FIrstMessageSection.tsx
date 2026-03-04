import useUserStore from "../../store/userStore";


const FIrstMessageSection = () => {
  const { user } = useUserStore();
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-black">
          Hello <span className="text-primary">{user?.name}</span>,
        </h1>
        <p className="text-xl md:text-2xl ">
          What do you want to know today?
        </p>
      </div>
      
      {/* Optional: Add some quick prompt suggestions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <button className="bg-black/10 hover:bg-black/20 transition p-4 rounded-xl text-left border border-black/20">
          <p className="text-black font-medium">Property Dispute</p>
          <p className=" text-sm mt-1">Ask about land ownership issues</p>
        </button>
        <button className="bg-black/10 hover:bg-black/20 transition p-4 rounded-xl text-left border border-black/20">
          <p className="text-black font-medium">Business Registration</p>
          <p className=" text-sm mt-1">Learn about registration process</p>
        </button>
        <button className="bg-black/10 hover:bg-black/20 transition p-4 rounded-xl text-left border border-black/20">
          <p className="text-black font-medium">Labor Rights</p>
          <p className=" text-sm mt-1">Employee rights and regulations</p>
        </button>
        <button className="bg-black/10 hover:bg-black/20 transition p-4 rounded-xl text-left border border-black/20">
          <p className="text-black font-medium">Legal Documents</p>
          <p className=" text-sm mt-1">Help with legal documentation</p>
        </button>
      </div>
    </div>
  )
}

export default FIrstMessageSection