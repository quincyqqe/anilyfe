'use client';

import { createPlayer } from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';

export const { Player, useMedia } = createPlayer({
  features: videoFeatures,
});
