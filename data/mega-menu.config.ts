export type MegaMenuLink = {
  label: string
  href: string
}

export type MegaMenuColumn = {
  title: string
  links: MegaMenuLink[]
}

export type MegaMenuQuickLink = {
  label: string
  href: string
}

export type MegaMenuTab = {
  id: string
  label: string
  personaFacet: 'her' | 'him' | 'couples'
  collectionSlug: string
  ctaLabel: string
  quickLinks: MegaMenuQuickLink[]
  columns: MegaMenuColumn[]
}

export type MegaMenuConfig = {
  tabs: MegaMenuTab[]
}

export const megaMenuConfig: MegaMenuConfig = {
  tabs: [
    {
      id: 'for-her',
      label: 'Para ella',
      personaFacet: 'her',
      collectionSlug: 'para-ella',
      ctaLabel: 'Ver colección para ella',
      quickLinks: [
        { label: 'Succionadores', href: '/categoria/clitorales' },
        { label: 'Vibradores rabbit', href: '/categoria/rabbits' },
        { label: 'Lubricantes íntimos', href: '/categoria/lubricantes' }
      ],
      columns: [
        {
          title: 'Vibradores y succionadores',
          links: [
            {
              label: 'Succionadores clitorales',
              href: '/categoria/clitorales'
            },
            {
              label: 'Vibradores rabbit',
              href: '/categoria/rabbits'
            },
            {
              label: 'Vibradores clásicos',
              href: '/categoria/clasicos'
            },
            {
              label: 'Vibradores anales',
              href: '/categoria/anales'
            }
          ]
        },
        {
          title: 'Otras texturas y formas',
          links: [
            {
              label: 'Consoladores realistas',
              href: '/categoria/consoladores'
            },
            {
              label: 'Strapless y dobles',
              href: '/categoria/dobles'
            },
            {
              label: 'Juguetes tipo wand',
              href: '/categoria/extremo'
            }
          ]
        },
        {
          title: 'Bienestar y autocuidado',
          links: [
            {
              label: 'Lubricantes y geles',
              href: '/categoria/lubricantes'
            },
            {
              label: 'Bolas chinas y Kegel',
              href: '/categoria/bolaschinas'
            },
            {
              label: 'Feromonas y aromas',
              href: '/categoria/feromonas'
            }
          ]
        }
      ]
    },
    {
      id: 'for-him',
      label: 'Para él',
      personaFacet: 'him',
      collectionSlug: 'para-el',
      ctaLabel: 'Ver colección para él',
      quickLinks: [
        { label: 'Masturbadores realistas', href: '/categoria/fleshlight' },
        { label: 'Anillos vibradores', href: '/categoria/anillos' },
        { label: 'Bombas de vacío', href: '/categoria/bombas-succionadoras' }
      ],
      columns: [
        {
          title: 'Mangas y masturbadores',
          links: [
            {
              label: 'Fleshlight y realistas',
              href: '/categoria/fleshlight'
            },
            {
              label: 'Mangas compactas',
              href: '/categoria/masturbadores'
            },
            {
              label: 'Automáticos y high-tech',
              href: '/categoria/mega'
            }
          ]
        },
        {
          title: 'Control del rendimiento',
          links: [
            {
              label: 'Anillos y cockrings',
              href: '/categoria/anillos'
            },
            {
              label: 'Geles retardantes',
              href: '/categoria/retardantes'
            },
            {
              label: 'Desarrolladores',
              href: '/categoria/desarrolladores'
            }
          ]
        },
        {
          title: 'Exploración avanzada',
          links: [
            {
              label: 'Plugs y masaje prostático',
              href: '/categoria/plugs'
            },
            {
              label: 'Fundas texturizadas',
              href: '/categoria/fundas'
            },
            {
              label: 'Bombas de succión',
              href: '/categoria/bombas-succionadoras'
            }
          ]
        }
      ]
    },
    {
      id: 'for-couples',
      label: 'Parejas',
      personaFacet: 'couples',
      collectionSlug: 'para-parejas',
      ctaLabel: 'Ver colección para parejas',
      quickLinks: [
        { label: 'Arneses y strap-ons', href: '/categoria/arneses-protesis' },
        { label: 'Juegos anales en conjunto', href: '/categoria/plugs' },
        { label: 'Ambiente sensorial', href: '/categoria/feromonas' }
      ],
      columns: [
        {
          title: 'Para compartir vibraciones',
          links: [
            {
              label: 'Vibradores para parejas',
              href: '/categoria/vibradores'
            },
            {
              label: 'Arneses y strap-ons',
              href: '/categoria/arneses-protesis'
            },
            {
              label: 'Anillos vibradores',
              href: '/categoria/anillos'
            }
          ]
        },
        {
          title: 'Nuevas dinámicas',
          links: [
            {
              label: 'Plugs y estimulación anal',
              href: '/categoria/plugs'
            },
            {
              label: 'Consoladores dobles',
              href: '/categoria/dobles'
            },
            {
              label: 'Elementos BDSM y juegos',
              href: '/categoria/sadobondage'
            }
          ]
        },
        {
          title: 'Ambientación y sensorial',
          links: [
            {
              label: 'Lubricantes y potenciadores',
              href: '/categoria/lubricantes'
            },
            {
              label: 'Feromonas y perfumes',
              href: '/categoria/feromonas'
            },
            {
              label: 'Fetiches y roleplay',
              href: '/categoria/fetiches'
            }
          ]
        }
      ]
    }
  ]
}
