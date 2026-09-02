/**
 * Editorial image — one render path for the site's two illustration
 * styles. SVG illustrations keep the <object> element (with <img>
 * fallback); photographs (webp) render as <img> with an object-cover
 * crop. Callers own sizing via className.
 */
export function EditorialImage({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  if (src.endsWith(".svg")) {
    return (
      <object
        type="image/svg+xml"
        data={src}
        aria-hidden="true"
        className={className}
      >
        <img src={src} alt="" aria-hidden="true" />
      </object>
    );
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`${className} object-cover`}
    />
  );
}
