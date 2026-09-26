import React from 'react';

/**
 * Global SVG filter bank (mounted once at the root). Use from CSS as
 * filter: url(#posterize) etc.
 */
export const SvgDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
    <defs>
      <filter id="only-r" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="only-g" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="only-b" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
      <filter id="posterize" colorInterpolationFilters="sRGB">
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 0.3 0.6 0.85 1" />
          <feFuncG type="discrete" tableValues="0 0.3 0.6 0.85 1" />
          <feFuncB type="discrete" tableValues="0 0.3 0.6 0.85 1" />
        </feComponentTransfer>
      </filter>
      <filter id="deepfry" colorInterpolationFilters="sRGB">
        <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" preserveAlpha="true" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 0.2 0.55 0.9 1" />
          <feFuncG type="discrete" tableValues="0 0.15 0.45 0.8 1" />
          <feFuncB type="discrete" tableValues="0 0.25 0.6 1" />
        </feComponentTransfer>
      </filter>
      <filter id="engrave" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0.08 0.08 0.55 0.93 0.93" />
          <feFuncG type="discrete" tableValues="0.06 0.06 0.5 0.87 0.87" />
          <feFuncB type="discrete" tableValues="0.04 0.04 0.4 0.76 0.76" />
        </feComponentTransfer>
      </filter>
      <filter id="threshold" colorInterpolationFilters="sRGB">
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncR type="discrete" tableValues="0 1" />
          <feFuncG type="discrete" tableValues="0 1" />
          <feFuncB type="discrete" tableValues="0 1" />
        </feComponentTransfer>
      </filter>
      <filter id="heat" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
);
