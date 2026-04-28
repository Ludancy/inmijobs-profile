import { createFileRoute } from '@tanstack/react-router';
import React, { useState, useCallback } from 'react';
import type { Friend, Photo, Post } from '@/features/profile';
import { ProfileHeader } from '@/features/profile';
import { ProfileTabTodo } from '@/features/profile/components/ProfileTabTodo';
import { ProfileTabInfo } from '@/features/profile/components/ProfileTabInfo';
import { authClient } from '@/lib/auth';
import { useAppUser } from '@/lib/userContext';
import { Button } from '@/components/ui/button';
import Cropper from 'react-easy-crop'; 

export const Route = createFileRoute('/(private)/profile')({
  component: ProfilePage,
});

const TABS = ['Todo', 'Información', 'Amigos', 'Fotos', 'Reels', 'Más'] as const;
type TabType = typeof TABS[number];

// --- FUNCIÓN MÁGICA DE RECORTAR Y COMPRIMIR ---
// Toma la imagen original y las coordenadas del recorte, y devuelve el Base64 listo para Go
const getCroppedImg = async (imageSrc: string, pixelCrop: any, maxWidth = 800): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Redimensionamos si el recorte es muy grande para no saturar la BD
  let targetWidth = pixelCrop.width;
  let targetHeight = pixelCrop.height;
  if (targetWidth > maxWidth) {
    const ratio = maxWidth / targetWidth;
    targetWidth = maxWidth;
    targetHeight = targetHeight * ratio;
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Dibujamos solo la porción recortada en el canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return canvas.toDataURL('image/jpeg', 0.8);
};

// Convierte el archivo seleccionado a una URL temporal para que el Cropper la lea
const readFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
};

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('Todo');
  const { user, setUser } = useAppUser();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingField, setEditingField] = useState<null | 'avatar' | 'banner'>(null);

  // Estados para el Cropper
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: session } = authClient.useSession();
  if (!session || !user) {
    return <div className="p-4">Cargando perfil…</div>;
  }

  const [friends] = useState<Array<Friend>>([
    { id: '1', name: 'Alexis Diaz', avatarUrl: '/assets/mascota/2.png' },
    { id: '2', name: 'Eduardo Crespo', avatarUrl: '/assets/brand/icon.png' },
  ]);

  const [photos] = useState<Array<Photo>>([
    { id: '1', url: '/assets/brand/isologo.png' },
    { id: '2', url: '/assets/mascota/2.png' },
    { id: '3', url: '/assets/brand/icon.png' },
  ]);

  const [posts] = useState<Array<Post>>([
    {
      id: '1',
      author: user,
      content: 'Mascota corporativa y concepts arts, para una red social dedicada a turistas e inmigrantes...',
      imageUrl: '/assets/mascota/1.png',
      likes: 12,
      comments: 5,
      timestamp: '2 días',
    }
  ]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Todo': return <ProfileTabTodo user={user} friends={friends} photos={photos} posts={posts} />;
      case 'Información': return <ProfileTabInfo />;
      default: return <div className="p-4 bg-white mt-4 rounded-xl border">Vista de {activeTab} (En construcción)</div>;
    }
  };

  // 1. Cuando el usuario selecciona una foto del disco
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl); // Mostramos el editor
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 2. Cuando el usuario presiona "Guardar Recorte"
  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsUploading(true);

    try {
      // Recortamos la imagen usando nuestra función
      const base64Image = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Enviamos a Go
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profiles/me/image`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) throw new Error(`Error en el servidor: ${response.status}`);

      // Actualizamos UI
      setUser((prev) => prev ? { ...prev, avatarUrl: base64Image } : prev);

      closeModal();
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al intentar subir la foto recortada.");
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setPickerOpen(false);
    setEditingField(null);
    setImageSrc(null); // Limpiamos el editor
    setZoom(1);
  };

  // Calculamos la proporción dependiendo si edita el banner (alargado) o el avatar (cuadrado)
  const cropAspect = 1 / 1;
  const cropShape = 'round';

  return (
    <div className="container mx-auto max-w-4xl py-3 px-2 sm:px-0 space-y-2">
      <ProfileHeader
        user={user}
        onEditProfile={(what) => {
          setEditingField(what);
          setPickerOpen(true);
        }}
      />

      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-card rounded-xl p-6 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">
              {editingField === 'banner' ? 'Encuadrar imagen de banner' : 'Encuadrar foto de perfil'}
            </h3>
            
            {/* Si aún no hay imagen, mostramos el selector de archivos */}
            {!imageSrc ? (
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100 dark:file:bg-muted dark:file:text-foreground"
                />
              </div>
            ) : (
              // Si ya seleccionó imagen, mostramos el editor
              <>
                <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shrink-0" style={{ height: '350px' }}>
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={cropAspect}
                    cropShape={cropShape}
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm font-medium">Zoom</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={closeModal} disabled={isUploading}>
                Cancelar
              </Button>
              {imageSrc && (
                <Button onClick={handleSaveCrop} disabled={isUploading}>
                  {isUploading ? 'Guardando...' : 'Guardar y Subir'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs Menu... */}
      <div className="flex border-b dark:border-border overflow-x-auto -mx-2 px-2 mt-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 font-medium text-sm whitespace-nowrap transition-colors relative
                ${isActive ? 'text-blue-600' : 'text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-muted/20 rounded-t-md'}`}
            >
              {tab}
              {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
            </button>
          );
        })}
      </div>

      <div className="min-h-100 transition-all">
        {renderTabContent()}
      </div>
    </div>
  );
}