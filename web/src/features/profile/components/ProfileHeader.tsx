import { useRef, useState } from "react";
import { ChevronDown, Edit, GraduationCap, MapPin } from "lucide-react";
import type { User } from "../types";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  user: User;
  onEditProfile?: (what: 'avatar' | 'banner') => void;
}

export function ProfileHeader({ user, onEditProfile }: ProfileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);    
  };
  const triggerEdit = (what: 'avatar' | 'banner') => {
    onEditProfile?.(what);
    setMenuOpen(false);
  };

  return (
      <div className="bg-white dark:bg-card rounded-xl shadow-sm border dark:border-border flex flex-col shrink-0">      
        <div className="h-28 md:h-40 bg-gradient-to-r from-[#fa8353] to-[#9256f4] relative shrink-0 rounded-t-xl">
        {user.tagline && (
          <div className="absolute right-4 md:right-6 bottom-3 md:bottom-4 max-w-[16rem] text-right">
            <p className="text-white/95 text-sm md:text-base font-medium drop-shadow-lg">
              {user.tagline}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 px-4 md:px-5 pt-4 pb-3 items-center">
        <div className="relative shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-muted/80 ring-2 ring-violet-200 dark:ring-violet-800 shadow-md overflow-hidden flex items-center justify-center">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          {user.flags && user.flags.length > 0 && (
            <div className="absolute bottom-0 right-0 flex -space-x-1.5" title="Ubicación · Mercado internacional">
              {user.flags.slice(0, 3).map((code) => (
                <img
                  key={code}
                  src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
                  alt={code}
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover border-2 border-white dark:border-card shadow-md ring-1 ring-black/10"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold truncate">{user.name}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{user.friendsCount} conexiones</p>
              {user.role && <p className="text-primary font-medium text-sm mt-1">{user.role}</p>}
              {user.location && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                  {user.location.split(' · ').map((part, i) => (
                    <span key={i} className="flex items-center gap-1">
                      {i === 0 ? <MapPin className="w-3.5 h-3.5 shrink-0" /> : <GraduationCap className="w-3.5 h-3.5 shrink-0" />}
                      {part.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex flex-wrap gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={handleToggle}>
                <Edit className="w-4 h-4 sm:mr-1" />Editar perfil
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={handleToggle}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>

              {/* Menú desplegable posicionado con Tailwind */}
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  {/* AQUÍ ESTÁ LA MAGIA: absolute, top-full, right-0 y mt-2 */}
                  <div className="absolute top-full right-0 mt-2 z-40 w-48 bg-white dark:bg-card border dark:border-border rounded-xl shadow-lg overflow-hidden">
                    <button
                      className="w-full text-left px-4 py-2 text-slate-400 cursor-not-allowed text-sm font-medium"
                      onClick={() => alert("La subida de imágenes está temporalmente deshabilitada por mantenimiento.")}
                      title="Temporalmente deshabilitado"
                    >
                      Cambiar foto de perfil (Deshabilitado)
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
