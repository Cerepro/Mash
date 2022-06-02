import Gruppe from './Gruppe.js'


class Shopping {
  gruppenListe = []
  aktiveGruppe = null
  meldungenAusgeben = true
  SORTIERUNGEN = {
    "Eigene Reihenfolge": this.sortiereIndex,
    "Aufsteigend": this.sortiereAufsteigend,
    "Absteigend": this.sortiereAbsteigend
  }
  sortierung = Object.keys(this.SORTIERUNGEN)[0]
  STORAGE_KEY = "einkaufslisteDaten"


  gruppeFinden(suchName, meldungAusgeben) {
    for (let gruppe of this.gruppenListe) {
      if (gruppe.name == suchName) {
        return gruppe
      }
    }
    // nichts gefunden, meldung ausgeben
    if (meldungAusgeben) {
      this.informieren("[App] Gruppe \"" + name + "\" nicht gefunden", true)
    }
    return null
  }


  gruppeHinzufuegen(name) {
    let vorhandeneGruppe = this.gruppeFinden(name)
    if (!vorhandeneGruppe) {
      let neueGruppe = new Gruppe(name, this.gruppenListe.length)
      this.gruppenListe.push(neueGruppe)
      this.aktiveGruppe = neueGruppe
      this.informieren("[App] Gruppe \"" + name + "\" hinzugefügt")
      return neueGruppe
    } else {
      this.informieren("[App] Gruppe \"" + name + "\" existiert schon!", true)
    }
  }


  gruppeEntfernen(name) {
    let loeschGruppe = this.gruppeFinden(name)
    if (loeschGruppe) {
      let index = this.gruppenListe.indexOf(loeschGruppe)
      this.gruppenListe.splice(index, 1)
      this.informieren("[App] Gruppe \"" + name + "\" entfernt"
      )
    } else {
      this.informieren("[App] Gruppe \"" + name + "\" konnte NICHT entfernt werden!", true)
    }
  }


  gruppeUmbenennen(alterName, neuerName) {
    let suchGruppe = this.gruppeFinden(alterName, true)
    if (suchGruppe) {
      suchGruppe.name = neuerName
      this.informieren("[App] Gruppe \"" + alterName + "\" umbenannt in \"" + neuerName + "\"")
    }
  }


  allesAuflisten() {
    console.debug("Watchlist")
    console.debug("--------------------")
    for (const gruppe of this.gruppenListe) {
      console.debug("[" + gruppe.name + "]")
      gruppe.artikelAuflisten(false)
    }
  }


  /**
   * Gibt eine Meldung aus und speichert den aktuellen Zustand im LocalStorage
   * @param {String} nachricht - die auszugebende Nachricht
   * @param {boolean} istWarnung - steuert, ob die {@link nachricht} als Warnung ausgegeben wird
   */
  informieren(nachricht, istWarnung = false) {
    if (this.meldungenAusgeben) {
      if (istWarnung) {
        console.log(nachricht)
      } else {
        console.debug(nachricht)
        this.speichern()
      }
    }
  }

  sortieren(reihenfolge) {
    this.sortierung = reihenfolge
    const sortierFunktion = this.SORTIERUNGEN[reihenfolge]
    // sortiere zuerst die Gruppen
    this.gruppenListe.sort(sortierFunktion)

    // sortiere danach die Artikel jeder Gruppe
    for (let gruppe of this.gruppenListe) {
      gruppe.artikelListe.sort(sortierFunktion)
    }
    this.informieren("[App] nach \"" + reihenfolge + "\" sortiert")
  }


  sortiereAufsteigend(a, b) {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    return nameA < nameB ? -1 : (nameA > nameB ? 1 : 0)
  }

  sortiereAbsteigend(a, b) {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()
    return nameA < nameB ? 1 : (nameA > nameB ? -1 : 0)
  }

  sortiereIndex(a, b) {
    return a.index < b.index ? -1 : (a.index > b.index ? 1 : 0)
  }


  speichern(daten) {
    const json = {
      gruppenListe: this.gruppenListe,
      aktiveGruppeName: this.aktiveGruppe.name,
    }
    // Object.assign(json, daten)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(json))
  }


  laden() {
    const daten = localStorage.getItem(this.STORAGE_KEY)
    if (!daten) return false
    this.initialisieren(JSON.parse(daten))
    return true
  }


  initialisieren(jsonDaten,) {
    this.gruppenListe = []
    for (let gruppe of jsonDaten.gruppenListe) {
      let neueGruppe = this.gruppeHinzufuegen(gruppe.name)
      for (let artikel of gruppe.artikelListe) {
        neueGruppe.artikelObjektHinzufuegen(artikel)
      }
    }
    this.aktiveGruppe = this.gruppeFinden(jsonDaten.aktiveGruppeName)
  }
}

const Modell = new Shopping()

export default Modell
