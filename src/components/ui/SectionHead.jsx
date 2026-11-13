export default function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  aside,
  className = '',
}) {
  return (
    <div className={`section-head ${className}`.trim()}>
      <div className="section-head__title">
        <span className="eyebrow">
          <span className="index">{index}</span>
          {eyebrow}
        </span>
        <h2 className="section-title">{title}</h2>
      </div>
      {(lede || aside) && (
        <div className="section-head__aside">
          {lede && <p className="section-lede">{lede}</p>}
          {aside}
        </div>
      )}
    </div>
  )
}
