// Every top-level section: an anchor id for the nav and presenter mode.
export function Section({ id, children, className = '' }) {
  return (
    <section id={id} data-section className={`relative scroll-mt-0 px-4 sm:px-8 ${className}`}>
      {children}
    </section>
  )
}
