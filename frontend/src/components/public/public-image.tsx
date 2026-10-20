'use client';

// Renders an optimized public ImageKit image with fallback placeholder handling and aspect ratio preservation.

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface PublicImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null;
  alt?: string;
  fallbackSrc?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
}

export const PublicImage: React.FC<PublicImageProps> = ({
  src,
  alt = 'Portfolio Media Asset',
  fallbackSrc = '/placeholder-media.svg',
  className = '',
  aspectRatio = 'auto',
  width,
  height,
  priority = false,
  fill,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return '';
    }
  };

  const imageSrc = !src || hasError ? fallbackSrc : src;
  const imageWidth = fill ? undefined : (width ?? 800);
  const imageHeight = fill ? undefined : (height ?? 600);
  const fillWrapperClass = fill ? 'absolute inset-0 w-full h-full' : '';

  return (
    <div className={`relative overflow-hidden bg-[var(--color-surface)] ${getAspectClass()} ${fillWrapperClass} ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={imageWidth}
        height={imageHeight}
        priority={priority}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-opacity duration-300"
        {...rest}
      />
    </div>
  );
};
