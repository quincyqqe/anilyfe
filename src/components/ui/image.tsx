'use client';

import NextImage, { ImageProps } from 'next/image';
import { Ref, forwardRef, useState } from 'react';

interface Props extends ImageProps {
  transitionDisabled?: boolean;
}

const Component = (
  { alt, className, transitionDisabled, ...props }: Props,
  ref: Ref<HTMLImageElement>,
) => {
  const [loaded, setLoaded] = useState(false);

  const combinedClassName = `${loaded ? 'opacity-100' : 'opacity-0'} ${
    !transitionDisabled ? '!transition' : ''
  } ${className ?? ''}`;

  return (
    <NextImage
      ref={ref}
      className={combinedClassName}
      onLoad={() => setLoaded(true)}
      quality={85}
      alt={alt}
      {...props}
    />
  );
};

export default forwardRef(Component);
