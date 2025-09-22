'use client'
import { useState } from 'react'
import { resolveAssetFolder, SUPPORTED_IMAGE_EXTENSIONS } from '@/lib/products'

type Extension = (typeof SUPPORTED_IMAGE_EXTENSIONS)[number]

function NSFWImage({ slug, index }: { slug: string; index: number }) {
  const [extIndex, setExtIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const ext: Extension = SUPPORTED_IMAGE_EXTENSIONS[extIndex]
  const assetFolder = resolveAssetFolder({ nsfw: true })
  const src = `/${assetFolder}/${slug}/${index}.${ext}`

  if (failed) {
    return (
      <div className="w-full rounded-xl border border-dashed p-6 text-center text-xs text-neutral-500">
        Imagen {index} no disponible
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`Imagen ${index} de ${slug}`}
      className="w-full rounded-xl border"
      loading="lazy"
      onError={() => {
        if (extIndex < SUPPORTED_IMAGE_EXTENSIONS.length - 1) {
          setExtIndex(prev => prev + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}

export default function NSFWGallery({ slug, count }: { slug: string; count: number }) {
  const [show, setShow] = useState(false)
  if (!count) {
    return <div className="text-xs text-neutral-500">Imágenes disponibles al publicar</div>
  }
  return (
    <div className="w-full">
      {!show ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <div className="text-sm font-medium">Imágenes sensibles — sólo para mayores de 18</div>
          <p className="text-xs text-neutral-600 mt-1">Al continuar confirma su intención de ver imágenes del producto.</p>
          <button onClick={() => setShow(true)} className="mt-3 px-4 py-2 rounded-xl bg-brand-primary text-white">Mostrar imágenes</button>
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <NSFWImage key={i} slug={slug} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  )
}