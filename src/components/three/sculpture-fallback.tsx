import Image from 'next/image';

/** Kept separate from the WebGL bundle so the loading/error path stays lightweight. */
export function SculptureFallback() {
  return <div className="heritage-fallback"><Image src="/images/heritage-reference.png" alt="Sandstone pavilion with carved scalloped arches, floral stone screens and an antique brass dome" fill sizes="(max-width: 1023px) 90vw, 45vw" className="object-contain" /><span>Architectural study · static view</span></div>;
}
