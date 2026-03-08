import Hls from 'hls.js';
import type Artplayer from 'artplayer';

export function attachHls(video: HTMLVideoElement, src: string, art: Artplayer) {
  if (Hls.isSupported()) {
    if (art.hls) (art.hls as Hls).destroy();
    const hls = new Hls();
    hls.loadSource(src);
    hls.attachMedia(video);
    art.hls = hls;
    art.on('destroy', () => hls.destroy());
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
  } else {
    art.notice.show = 'Unsupported playback format: m3u8';
  }
}
