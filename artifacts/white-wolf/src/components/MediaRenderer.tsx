import { isVideo } from '../lib/media';

interface MediaRendererProps {
  src: string;
  alt?: string;
  className?: string;
  /** Show playback controls (for modal/full view) */
  controls?: boolean;
  /** Silent autoplay loop (for card thumbnails) */
  preview?: boolean;
}

export function MediaRenderer({ src, alt, className, controls = false, preview = false }: MediaRendererProps) {
  if (!src) return null;

  if (isVideo(src)) {
    return (
      <video
        src={src}
        className={className}
        controls={controls}
        autoPlay={preview}
        muted={preview || !controls}
        loop={preview}
        playsInline
      />
    );
  }

  return <img src={src} alt={alt ?? ''} className={className} />;
}
