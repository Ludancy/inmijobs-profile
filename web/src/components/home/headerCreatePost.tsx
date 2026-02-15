import { ImageIcon, Smile, Video } from "lucide-react"

export const HeaderCreatePost = () => {
    return (
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex gap-3 items-center">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full" alt="User" />
                <button
                    type="button"
                    className="text-black flex-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-2 text-gray-500 cursor-pointer text-sm text-left"
                >
                    ¿Qué estás pensando, Meyerowitz?
                </button>
                <div className="flex gap-2 text-gray-500">
                    <Video size={20} className="text-red-500 cursor-pointer" />
                    <ImageIcon size={20} className="text-green-500 cursor-pointer" />
                    <Smile size={20} className="text-yellow-500 cursor-pointer" />
                </div>
            </div>
        </section>
    )
}