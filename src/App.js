import React from 'react'
import Modell from './model/Shopping'
import GruppenTag from './components/GruppenTag'
import GruppenDialog from './components/GruppenDialog'
import SortierDialog from "./components/SortierDialog";

/**
 * @version 1.0
 * @author Naumann Patrick <Patrick.Naumann2022@Gmail.com>
 * @description Diese App ist eine Einkaufsliste mit React.js und separatem Model, welche Offline verwendet werden kann
 * @license Gnu Public Lesser License 3.0
 *
 */


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aktiveGruppe: null,
      showGruppenDialog: false,
      showSortierDialog: false,
      einkaufenAufgeklappt: true,
      erledigtAufgeklappt: false,
      isEditing: false,
      newSerie:""
    }
  }

  componentDidMount() {
    if (!Modell.laden()) {

    }
    this.setState(this.state)
  }


  einkaufenAufZuKlappen() {
    let neuerZustand = !this.state.einkaufenAufgeklappt
    this.setState({einkaufenAufgeklappt: neuerZustand})
  }

  lsLoeschen() {
    if (confirm("Wollen Sie wirklich alles löschen?!")) {
      localStorage.clear()
    }
  }

  erledigtAufZuKlappen() {
    this.setState({erledigtAufgeklappt: !this.state.erledigtAufgeklappt})
  }

  /**
   * Hakt einen Artikel ab oder reaktiviert ihn
   * @param {Artikel} artikel - der aktuelle Artikel, der gerade abgehakt oder reaktiviert wird
   */
  artikelChecken = (artikel) => {
    artikel.gekauft = !artikel.gekauft
    const aktion = (artikel.gekauft) ? "erledigt" : "reaktiviert"
    Modell.informieren("[App] Artikel \"" + artikel.name + "\" wurde " + aktion)
    this.setState(this.state)
  }

  artikelHinzufuegen() {
    const eingabe = document.getElementById("artikelEingabe")
    const artikelName = eingabe.value.trim()
    if (artikelName.length > 0) {
      Modell.aktiveGruppe.artikelHinzufuegen(artikelName)
      this.setState(this.state)
    }
    eingabe.value = ""
    eingabe.focus()
  }

  setAktiveGruppe(gruppe) {
    Modell.aktiveGruppe = gruppe
    Modell.informieren("[App] Gruppe \"" + gruppe.name + "\" ist nun aktiv")
    this.setState({aktiveGruppe: Modell.aktiveGruppe})
  }

  closeSortierDialog = (reihenfolge, sortieren) => {
    if (sortieren) {
      Modell.sortieren(reihenfolge)
    }
    this.setState({showSortierDialog: false})
  }

  /**
   * Reagiert auf Änderungen im Eingabefeld und speichert den neuen Wert im newName-state
   * @param {Event.CHANGE} event - das Change-Event im Eingabefeld
   */
  handleChange(event) {
      this.setState({newSerie: event.target.value})
  }

  serieUmbenennen(serie, event){
    if (event && event.key != "Enter") return
    this.setState({newSerie : serie})
    this.setState({isEditing: false})
  }

  render() {

    let serie = this.state.newSerie
    let nochNichtGesehen = []
    if (this.state.einkaufenAufgeklappt == true) {
      for (const gruppe of Modell.gruppenListe) {
        nochNichtGesehen.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={false}
          aktiv={gruppe == this.state.aktiveGruppe}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }

    let schonGesehen = []
    if (this.state.erledigtAufgeklappt) {
      for (const gruppe of Modell.gruppenListe) {
        schonGesehen.push(<GruppenTag
          key={gruppe.id}
          gruppe={gruppe}
          gekauft={true}
          aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
          checkHandler={this.artikelChecken}/>)
      }
    }

    let gruppenDialog = ""
    if (this.state.showGruppenDialog) {
      gruppenDialog = <GruppenDialog
        gruppenListe={Modell.gruppenListe}
        onDialogClose={() => this.setState({showGruppenDialog: false})}/>
    }

    let sortierDialog = ""
    if (this.state.showSortierDialog) {
      sortierDialog = <SortierDialog onDialogClose={this.closeSortierDialog}/>
    }

    // erlaubt das abhaken und reaktivieren
    const viewTemplate = (
      <dt>
        <h1>{this.state.newSerie}</h1>
          <i className="material-icons"
             onClick={() => this.setState({isEditing: true})}>edit</i>
      </dt>

    )


    let editSerieTemplate = (
      <dd>
        <input type="search" value={this.state.newSerie} autoFocus={true}
               onChange={event => this.handleChange(event)}
        />
        <i className="material-icons"
           onClick={() => this.setState({isEditing: false})}>cancel </i>
        <i className="material-icons"
           onClick={() => this.serieUmbenennen(serie)}>check_circle  </i>
      </dd>
    )

    return (
      <div id="container">
        <header>
          {this.state.isEditing? (editSerieTemplate):(viewTemplate)}
          <label
            className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
            <span className="mdc-text-field__ripple"></span>
            <input className="mdc-text-field__input" type="search"
                   id="artikelEingabe" placeholder="Folge hinzufügen"
                   onKeyPress={e => (e.key == 'Enter') ? this.artikelHinzufuegen() : ''}/>
            <span className="mdc-line-ripple"></span>
            <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
               tabIndex="0" role="button"
               onClick={() => this.folgeHinzufuegen()}>add_circle</i>
          </label>

        </header>
        <hr/>

        <main>
          <section>
            <h2>Noch nicht Gesehen
              <i onClick={() => this.einkaufenAufZuKlappen()} className="material-icons">
                {this.state.einkaufenAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {nochNichtGesehen}
            </dl>
          </section>
          <hr/>
          <section>
            <h2> schon Gesehen
              <i onClick={() => this.erledigtAufZuKlappen()} className="material-icons">
                {this.state.erledigtAufgeklappt ? 'expand_more' : 'expand_less'}
              </i>
            </h2>
            <dl>
              {schonGesehen}
            </dl>
          </section>
        </main>
        <hr/>

        <footer>
          <button className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showGruppenDialog: true})}>
            <span className="material-icons">bookmark_add</span>
            <span className="mdc-button__ripple"></span> Staffel
          </button>

          <button className="mdc-button mdc-button--raised"
                  onClick={() => this.setState({showSortierDialog: true})}>

            <span className="material-icons">sort</span>
            <span className="mdc-button__ripple"></span> Sort
          </button>
          <button className="mdc-button mdc-button--raised">
            <span className="material-icons">settings</span>
          </button>
          <button className="mdc-button mdc-button--raised"
                  onClick={this.lsLoeschen}>
            <span className="material-icons">clear_all</span>
            <span className="mdc-button__ripple"></span> Clear
          </button>
        </footer>

        {gruppenDialog}
        {sortierDialog}
      </div>
    )
  }
}

export default App
