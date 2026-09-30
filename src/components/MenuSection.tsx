import { MENU, type MenuItem } from '@/data/menu'
import { RiyalSign } from '@/components/RiyalSign'
import { useLang } from '@/lib/i18n'

function Row({ item }: { item: MenuItem }) {
  const { p, n, t } = useLang()

  return (
    <li className="border-rule flex items-center justify-between gap-4 border-b py-3 last:border-b-0">
      <div className="flex min-w-0 items-center gap-3">
        {item.image && (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            width={52}
            height={52}
            className="size-13 shrink-0 object-contain"
          />
        )}
        <div className="min-w-0">
          <span className="block text-[0.98rem]">{p(item.name)}</span>
          {item.note && <span className="text-moon-2 block text-xs">{p(item.note)}</span>}
          {item.kcal !== undefined && (
            <span className="text-moon-2 block text-xs">
              {n(item.kcal)} {t('kcal')}
            </span>
          )}
        </div>
      </div>

      <span className="text-gold flex shrink-0 items-center gap-1.5 font-semibold tabular-nums">
        {n(item.price)}
        <RiyalSign />
      </span>
    </li>
  )
}

export function MenuSection() {
  const { t, p } = useLang()

  return (
    <section id="menu" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <header className="mb-14 max-w-2xl">
          <h2 className="mb-3 text-3xl font-medium sm:text-4xl">{t('menu')}</h2>
          <p className="text-moon-2">{t('menuLead')}</p>
        </header>

        <div className="grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {MENU.map((cat) => (
            <div key={cat.id}>
              <h3 className="text-gold mb-4 text-lg font-medium">{p(cat.title)}</h3>
              {cat.groups.map((group, gi) => (
                <div key={gi}>
                  {group.label && (
                    <p className="text-moon-2 mt-5 mb-1 text-[0.7rem] font-semibold tracking-[0.12em] uppercase first:mt-0">
                      {p(group.label)}
                    </p>
                  )}
                  <ul>
                    {group.items.map((item) => (
                      <Row key={p(item.name)} item={item} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
