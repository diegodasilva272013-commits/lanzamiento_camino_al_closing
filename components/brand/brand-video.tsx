type BrandVideoProps = {
  className?: string;
  rounded?: string;
};

/**
 * Video del lanzamiento.
 * Se escala y desplaza dentro de un contenedor con overflow oculto
 * para que la marca de agua (generalmente en una esquina inferior)
 * quede recortada fuera del área visible.
 */
export function BrandVideo({ className, rounded = 'rounded-[2rem]' }: BrandVideoProps) {
  return (
    <div
      className={[
        'relative isolate overflow-hidden border border-[rgba(212,175,55,0.18)] bg-black shadow-[0_30px_80px_-35px_rgba(212,175,55,0.45)]',
        rounded,
        className ?? '',
      ].join(' ')}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {/* Wrapper que oculta la marca de agua recortando los bordes */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            src="/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          {/* Capa adicional sólida para tapar cualquier marca de agua de esquinas */}
          <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-32 bg-gradient-to-tl from-black via-black/80 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-32 bg-gradient-to-tr from-black via-black/70 to-transparent" />
        </div>

        {/* Degradados de marca para integrar el video con la landing */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[rgba(212,175,55,0.18)]" />
      </div>
    </div>
  );
}
