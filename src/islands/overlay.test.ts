// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fermer, nombreOuvertes, ouvrir } from './overlay'

function monter() {
  document.body.innerHTML = `
    <button id="declencheur">Ouvrir</button>
    <div id="panneau"><a id="premier" href="#a">A</a><a id="dernier" href="#b">B</a></div>`
  const get = (id: string) => {
    const element = document.getElementById(id)
    if (element === null) throw new Error(id)
    return element
  }
  return {
    declencheur: get('declencheur'),
    panneau: get('panneau'),
    premier: get('premier'),
    dernier: get('dernier'),
  }
}

const touche = (key: string, options: KeyboardEventInit = {}) =>
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options }),
  )

describe('pile des superpositions', () => {
  let fermetures = 0
  beforeEach(() => {
    fermetures = 0
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('ouvre en donnant le focus au premier élément', () => {
    const { declencheur, panneau, premier } = monter()
    ouvrir({ panneau, declencheur, surFermeture: () => (fermetures += 1) })
    expect(document.activeElement).toBe(premier)
    expect(nombreOuvertes()).toBe(1)
    fermer(panneau)
  })

  it('Échap ferme et rend le focus au déclencheur', () => {
    const { declencheur, panneau } = monter()
    ouvrir({ panneau, declencheur, surFermeture: () => (fermetures += 1) })
    touche('Escape')
    expect(fermetures).toBe(1)
    expect(nombreOuvertes()).toBe(0)
    expect(document.activeElement).toBe(declencheur)
  })

  it('piège le focus : Tab sur le dernier revient au premier, Maj+Tab inverse', () => {
    const { declencheur, panneau, premier, dernier } = monter()
    ouvrir({ panneau, declencheur, surFermeture: () => undefined })
    dernier.focus()
    touche('Tab')
    expect(document.activeElement).toBe(premier)
    touche('Tab', { shiftKey: true })
    expect(document.activeElement).toBe(dernier)
    fermer(panneau)
  })

  it('ne rend pas le focus quand on le demande, et ignore une double ouverture', () => {
    const { declencheur, panneau, dernier } = monter()
    const sur = { panneau, declencheur, surFermeture: () => (fermetures += 1) }
    ouvrir(sur)
    ouvrir(sur)
    expect(nombreOuvertes()).toBe(1)
    dernier.focus()
    fermer(panneau, { rendreFocus: false })
    expect(document.activeElement).toBe(dernier)
    expect(fermetures).toBe(1)
  })

  it('ferme la plus récente d’abord avec Échap', () => {
    const premiere = monter()
    ouvrir({
      panneau: premiere.panneau,
      declencheur: premiere.declencheur,
      surFermeture: () => (fermetures += 1),
    })
    const autre = document.createElement('div')
    autre.innerHTML = '<button id="x">X</button>'
    document.body.append(autre)
    ouvrir({
      panneau: autre,
      declencheur: premiere.premier,
      surFermeture: () => (fermetures += 10),
    })
    touche('Escape')
    expect(fermetures).toBe(10)
    expect(nombreOuvertes()).toBe(1)
    fermer(premiere.panneau)
  })
})
