import { isVideo } from '../lib/media';

interface MediaRendererProps {
  src: string;
  alt?: string;
  className?: string;
  /**
   * Show full browser playback controls (play, pause, volume, timeline).
   * When true the video is NOT muted so audio plays normally.
   */
  controls?: boolean;
  /**
   * Silent autoplay loop — used for card thumbnails.
   * Forces muted + autoPlay + loop, no controls.
   */
  preview?: boolean;
}

export function MediaRenderer({
  src,
  alt,
  className,
  controls = false,
  preview = false,
}: MediaRendererProps) {
  if (!src) return null;

  if (isVideo(src)) {
    return (
      <video
        src={src}
        className={className}
        /* Controls: full browser UI for play/pause/volume/timeline */
        controls={controls}
        /* Audio: only mute in silent preview thumbnails */
        muted={preview}
        /* Autoplay only for silent card previews */
        autoPlay={preview}
        loop={preview}
        playsInline
      />
    );
  }

  return <img src={src} alt={alt ?? ''} className={className} />;
}
