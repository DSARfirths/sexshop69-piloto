export type MegaMenuPersona = 'her' | 'him' | 'couples'

export type MegaMenuSubcategory = {
  name: string
  href: string
}

export type MegaMenuSection = {
  name: string
  subcategories: MegaMenuSubcategory[]
}

export type MegaMenuCategory = {
  id: string
  label: string
  personaFacet: MegaMenuPersona
  accentColor: string
  sections: MegaMenuSection[]
}

export type MegaMenuConfig = {
  categories: MegaMenuCategory[]
}

const buildHref = (slug: string) => `/categoria/${slug}`

export const megaMenuConfig: MegaMenuConfig = {
  categories: [
    {
      id: 'for-her',
      label: 'Para Ellas',
      personaFacet: 'her',
      accentColor: '#ff2193',
      sections: [
        {
          name: 'Vibradores',
          subcategories: [
            { name: 'Vibradores clásicos', href: buildHref('vibradores-clasicos') },
            { name: 'Vibradores clitorales', href: buildHref('vibradores-clitorales') },
            { name: 'Vibradores extremos', href: buildHref('vibradores-extremos') },
            { name: 'Vibradores rabbit', href: buildHref('vibradores-rabbit') },
            { name: 'Vibradores ciberskin y jelly', href: buildHref('vibradores-ciberskin-jelly') }
          ]
        },
        {
          name: 'Succionadores',
          subcategories: [
            { name: 'Succionadores clitorales', href: buildHref('succionadores-clitorales') }
          ]
        },
        {
          name: 'Consoladores',
          subcategories: [
            { name: 'Consoladores realistas', href: buildHref('consoladores-realistas') },
            { name: 'Consoladores dobles', href: buildHref('consoladores-dobles') },
            { name: 'Consoladores extremos', href: buildHref('consoladores-extremos') }
          ]
        },
        {
          name: 'Anales',
          subcategories: [
            { name: 'Dildos', href: buildHref('dildos') },
            { name: 'Bolas chinas y cuentas', href: buildHref('bolas-chinas-cuentas') }
          ]
        },
        {
          name: 'Bienestar y autocuidado',
          subcategories: [
            { name: 'Lubricantes y geles', href: buildHref('lubricantes-geles') },
            { name: 'Feromonas y excitantes', href: buildHref('feromonas-excitantes') }
          ]
        }
      ]
    },
    {
      id: 'for-him',
      label: 'Para Ellos',
      personaFacet: 'him',
      accentColor: '#1151bb',
      sections: [
        {
          name: 'Pene',
          subcategories: [
            { name: 'Acariciadores', href: buildHref('acariciadores') },
            { name: 'Masturbadores realistas', href: buildHref('masturbadores-realistas') },
            { name: 'Anillos vibradores', href: buildHref('anillos-vibradores') },
            { name: 'Bombas de succión', href: buildHref('bombas-succion') },
            { name: 'Extensiones de pene y mangas', href: buildHref('extensiones-pene-mangas') },
            { name: 'Fundas y prótesis', href: buildHref('fundas-protesis') }
          ]
        },
        {
          name: 'Anal',
          subcategories: [
            { name: 'Plugs y masaje prostático', href: buildHref('plugs-masaje-prostatico') },
            { name: 'Bolas chinas y cuentas', href: buildHref('bolas-chinas-cuentas') },
            { name: 'Prostáticos', href: buildHref('prostaticos') }
          ]
        },
        {
          name: 'Bienestar y autocuidado',
          subcategories: [
            { name: 'Geles retardantes', href: buildHref('geles-retardantes') },
            { name: 'Desarrolladores', href: buildHref('desarrolladores') },
            { name: 'Lubricantes y geles', href: buildHref('lubricantes-geles') },
            { name: 'Feromonas y excitantes', href: buildHref('feromonas-excitantes') }
          ]
        }
      ]
    },
    {
      id: 'for-couples',
      label: 'Para Parejas',
      personaFacet: 'couples',
      accentColor: '#0098d5',
      sections: [
        {
          name: 'Juguetes de parejas',
          subcategories: [
            { name: 'Control remoto', href: buildHref('control-remoto') },
            { name: 'Vibraciones en pareja', href: buildHref('vibraciones-en-pareja') },
            { name: 'Correas, prótesis y fundas', href: buildHref('correas-protesis-fundas') },
            { name: 'Consoladores dobles', href: buildHref('consoladores-dobles') },
            { name: 'Plugs y estimulación anal', href: buildHref('plugs-estimulacion-anal') }
          ]
        },
        {
          name: 'Parejas fetiches',
          subcategories: [
            { name: 'Restricciones y posicionador', href: buildHref('restricciones-posicionador') },
            { name: 'Paletas, látigos y BDSM', href: buildHref('paletas-latigos-bdsm') },
            { name: 'Arneses y prótesis', href: buildHref('arneses-protesis') }
          ]
        },
        {
          name: 'Más placer',
          subcategories: [
            { name: 'Juegos para adultos', href: buildHref('juegos-para-adultos') },
            { name: 'Lubricantes y potenciadores', href: buildHref('lubricantes-potenciadores') },
            { name: 'Feromonas y excitantes', href: buildHref('feromonas-excitantes') },
            { name: 'Fetiches y roleplay', href: buildHref('fetiches-roleplay') }
          ]
        }
      ]
    }
  ]
}

