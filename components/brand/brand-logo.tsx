import Image from 'next/image';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  priority?: boolean;
  className?: string;
};

const sizePx = {
  sm: 40,
  md: 56,
  lg: 88,
  xl: 128,
};

export function BrandLogo({ size = 'md', priority = false, className }: BrandLogoProps) {
  const px = sizePx[size];
  return (
    <div
      className={[
        'relative shrink-0 overflow-hidden rounded-full ring-1 ring-[rgba(212,175,55,0.35)] shadow-[0_8px_30px_-10px_rgba(212,175,55,0.55)]',
        className ?? '',
      ].join(' ')}
      style={{ width: px, height: px }}
    >
      <Image
        src="/logo_original.png"
        alt="Camino al Closing"
        fill
        priority={priority}
        sizes={`${px}px`}
        className="object-cover"
      />
    </div>
  );
}
