import { Link } from '@tanstack/react-router'
import {
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Newspaper,
  Settings,
  UserCircle,
  Users
} from 'lucide-react'
import { authClient } from '@/lib/auth'

import { useAppUser } from "@/lib/userContext";

export const Aside1 = () => {
  const session = authClient.useSession()
  const { user } = useAppUser();
  const current = user || session.data?.user;
  const avatarUrl = user?.avatarUrl || session.data?.user.image || "/assets/mascota/1.png";
  const displayName = current?.name || '';

  const menuItems = [
    { label: 'News Feed', icon: Newspaper, to: '/home', badge: 1 },
    { label: 'Portfolio', icon: Briefcase, to: '/portfolio' },
    { label: 'Messages', icon: MessageSquare, to: '/messages', badge: 6 },
    { label: 'Forums', icon: Users, to: '/forums', badge: 2 },
    { label: 'Friends', icon: UserCircle, to: '/friends', badge: 3 },
    { label: 'Media', icon: ImageIcon, to: '/media', badge: 1 },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ]

  return (
    <aside className="w-full flex flex-col gap-4 p-4 sticky top-0 h-full border-r border-[#E5E7EB] bg-white/80 backdrop-blur-md">
      <Link to="/profile" className="flex flex-col items-center py-6 hover:bg-gray-100 cursor-pointer rounded-lg">
        <div className="relative mb-4 flex justify-center w-full">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 ring-4 ring-white shadow-lg overflow-hidden flex items-center justify-center">
              <img
                src={avatarUrl}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            
            <div className="absolute bottom-0 right-0 flex -space-x-2 translate-x-2 translate-y-1">
              <img className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" src="https://upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg" alt="Badge 1" />
              <img className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm" src="https://s1.significados.com/foto/bandera-de-canada-cke.jpg?class=article" alt="Badge 2" />
            </div>
          </div>
        </div>
        <h2 className="font-bold mt-2 text-gray-800">{displayName}</h2>
        <p className="text-sm text-gray-400">@{displayName}</p>
      </Link>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-gray-600 hover:bg-gray-100"
            activeProps={{
              className: "!bg-black !text-white",
            }}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${'bg-gray-200 text-gray-700 group-active:bg-white'
                }`}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-gray-50 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center relative size-16 mb-6">
          <img src="/imagotipo.png" className="w-20" />
        </div>
        <p className="font-bold text-gray-800">Download</p>
      </div>
    </aside>
  )
}
