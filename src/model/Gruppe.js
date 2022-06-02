import Artikel from "./Artikel.js"
import Modell from "./Shopping.js"


class Gruppe {
  static counter = 1
  id = Gruppe.counter++
  index
  name
  artikelListe = []

  constructor(name, index) {
    this.name = name
    this.index = index
  }


  artikelFinden(suchName, meldungAusgeben) {
    for (let artikel of this.artikelListe) {
      if (artikel.name == suchName) {
        return artikel
      }
    }
    if (meldungAusgeben) {
      Modell.informieren("[" + this.name + "] Artikel " + suchName + " nicht gefunden", true)
    }
    return null
  }


  artikelAuflisten(gekauft) {
    for (let artikel of this.artikelListe) {
      if (artikel.gekauft == gekauft) {
        console.debug("  " + artikel.name)
      }
    }
  }


  artikelHinzufuegen(name) {
    let vorhandenerArtikel = this.artikelFinden(name, false)
    if (!vorhandenerArtikel) {
      let neuerArtikel = new Artikel(name, this.artikelListe.length)
      this.artikelListe.push(neuerArtikel)
      Modell.informieren("[" + this.name + "] Artikel " + name + " hinzugefügt")
      return neuerArtikel
    } else {
      Modell.informieren("[" + this.name + "] Artikel " + name + " existiert schon!", true)
    }
  }

  artikelEntfernen(name) {
    let loeschArtikel = this.artikelFinden(name)
    if (loeschArtikel) {
      const index = this.artikelListe.indexOf(loeschArtikel)
      this.artikelListe.splice(index, 1)
      this.artikelNeuNummerieren()
      Modell.informieren("[" + this.name + "] Artikel \"" + name + "\" entfernt"
      )
    } else {
      Modell.informieren("[" + this.name + "] Artikel \"" + name + "\" konnte NICHT entfernt werden", true
      )
    }
  }

  artikelNeuNummerieren() {
    for (let i = 0; i < this.artikelListe.length; i++) {
      this.artikelListe[i].index = i
    }
  }

  artikelUmbenennen(alterName, neuerName) {
    let vorhandenerArtikel = this.artikelFinden(alterName)
    if (vorhandenerArtikel) {
      vorhandenerArtikel.name = neuerName
    }
    Modell.informieren("[" + this.name + "] Artikel \"" + alterName + "\" umbenannt in \"" + neuerName + "\"")
  }
}

export default Gruppe
