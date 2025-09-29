export type MegaMenuLink = {
  label: string
  href: string
  description?: string
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
  tagline: string
  description: string
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
      tagline: 'Placer centrado en vulva y clítoris',
      description:
        'Vibradores, succionadores y accesorios que acompañan tu ritmo para descubrir nuevas sensaciones con confianza.',
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
              description: 'Estímulo preciso sin contacto directo',
              href: '/categoria/clitorales'
            },
            {
              label: 'Vibradores rabbit',
              description: 'Doble estimulación sincronizada',
              href: '/categoria/rabbits'
            },
            {
              label: 'Vibradores clásicos',
              description: 'Formas versátiles para principiantes',
              href: '/categoria/clasicos'
            },
            {
              label: 'Vibradores anales',
              description: 'Curvas suaves para experimentar',
              href: '/categoria/anales'
            }
          ]
        },
        {
          title: 'Otras texturas y formas',
          links: [
            {
              label: 'Consoladores realistas',
              description: 'Materiales suaves con detalles anatómicos',
              href: '/categoria/consoladores'
            },
            {
              label: 'Strapless y dobles',
              description: 'Diseños sin arnés para compartir sensaciones',
              href: '/categoria/dobles'
            },
            {
              label: 'Juguetes tipo wand',
              description: 'Masajeadores de alta potencia para todo el cuerpo',
              href: '/categoria/extremo'
            }
          ]
        },
        {
          title: 'Bienestar y autocuidado',
          links: [
            {
              label: 'Lubricantes y geles',
              description: 'Compatibles con juguetes y piel sensible',
              href: '/categoria/lubricantes'
            },
            {
              label: 'Bolas chinas y Kegel',
              description: 'Fortalece el suelo pélvico con diferentes niveles',
              href: '/categoria/bolaschinas'
            },
            {
              label: 'Feromonas y aromas',
              description: 'Fragancias afrodisíacas y aceites seductores',
              href: '/categoria/feromonas'
            }
          ]
        }
      ]
    },
    {
      id: 'for-him',
      label: 'Para él',
      tagline: 'Estimulación enfocada en pene y perineo',
      description:
        'Mangas, anillos y accesorios que potencian la intensidad, ayudan a entrenar el control y abren nuevas experiencias.',
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
              description: 'Texturas que envuelven con sensaciones fieles',
              href: '/categoria/fleshlight'
            },
            {
              label: 'Mangas compactas',
              description: 'Opciones discretas para uso frecuente',
              href: '/categoria/masturbadores'
            },
            {
              label: 'Automáticos y high-tech',
              description: 'Vibración, calor o empuje asistido',
              href: '/categoria/mega'
            }
          ]
        },
        {
          title: 'Control del rendimiento',
          links: [
            {
              label: 'Anillos y cockrings',
              description: 'Mantén la firmeza y agrega vibración',
              href: '/categoria/anillos'
            },
            {
              label: 'Geles retardantes',
              description: 'Dosificación precisa para prolongar el encuentro',
              href: '/categoria/retardantes'
            },
            {
              label: 'Desarrolladores',
              description: 'Bombas y extensores para entrenamiento gradual',
              href: '/categoria/desarrolladores'
            }
          ]
        },
        {
          title: 'Exploración avanzada',
          links: [
            {
              label: 'Plugs y masaje prostático',
              description: 'Curvas ergonómicas y vibración interna',
              href: '/categoria/plugs'
            },
            {
              label: 'Fundas texturizadas',
              description: 'Añade grosor y relieve a tus encuentros',
              href: '/categoria/fundas'
            },
            {
              label: 'Bombas de succión',
              description: 'Sensación de vacío controlada para nuevas sensaciones',
              href: '/categoria/bombas-succionadoras'
            }
          ]
        }
      ]
    },
    {
      id: 'for-couples',
      label: 'Parejas',
      tagline: 'Sincroniza el placer en dúo o trío',
      description:
        'Juguetes que se adaptan a distintas dinámicas, desde vibraciones compartidas hasta roles creativos con arneses y kits.',
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
              description: 'Modelos que acompañan la penetración',
              href: '/categoria/vibradores'
            },
            {
              label: 'Arneses y strap-ons',
              description: 'Cambia roles y posiciones con seguridad',
              href: '/categoria/arneses-protesis'
            },
            {
              label: 'Anillos vibradores',
              description: 'Vibración sincronizada para ambos cuerpos',
              href: '/categoria/anillos'
            }
          ]
        },
        {
          title: 'Nuevas dinámicas',
          links: [
            {
              label: 'Plugs y estimulación anal',
              description: 'Progresa en conjunto con tamaños graduales',
              href: '/categoria/plugs'
            },
            {
              label: 'Consoladores dobles',
              description: 'Diseños flexibles para usar al mismo tiempo',
              href: '/categoria/dobles'
            },
            {
              label: 'Elementos BDSM y juegos',
              description: 'Ataduras suaves, antifaces y fetiches',
              href: '/categoria/sadobondage'
            }
          ]
        },
        {
          title: 'Ambientación y sensorial',
          links: [
            {
              label: 'Lubricantes y potenciadores',
              description: 'Sensaciones cálidas, frías o con sabores',
              href: '/categoria/lubricantes'
            },
            {
              label: 'Feromonas y perfumes',
              description: 'Fragancias afrodisíacas para cada ocasión',
              href: '/categoria/feromonas'
            },
            {
              label: 'Fetiches y roleplay',
              description: 'Accesorios coquetos para subir la temperatura',
              href: '/categoria/fetiches'
            }
          ]
        }
      ]
    }
  ]
}
