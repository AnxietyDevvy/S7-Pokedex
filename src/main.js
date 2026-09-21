const categories = ['All', 'Rare', 'Paradox', 'Gmax']
const storageKey = 's7-pokemon-catalog'
const spriteFiles = {
  Rare: 'arceus archaludon articuno azelf blacephalon calyrex celebi cobalion cosmeom cosmog cresselia darkrai deoxys dialga dianie entei fezandipiti giratina glastrier groudon ho_oh hoopa jirachi keldeo koraidon kubfu kyogre kyurem landorus latias latios lugia lunala magearna manaphy marshadow meloetta mesprit mew mewtwo miriadon munkidori necrozma nihilego ogerpon okidogi palkia percharunt phione poipole raikou rayquaza regice regidrago regieleki regigigas regirock registeel reshiram shaymin silvally solgaleo spectrier suicune tapu_bulu tapu_fini tapu_koko tapu_lele terapagos thundurus tornadus type_null uxie victini virizion volcanion xerneas yvetal zacian zamazenta zapdos zarude zekrom zeraora zygarde'.split(' '),
  Paradox: 'brute_bonnet buzzwhole celesteela chi_yu chien_pao enamorus flutter_main genesect gouging_fire great_tusk guzzlord heatran iron_boulder iron_bundle iron_crown iron_hands iron_jugulis iron_leaves iron_moth iron_thorns iron_treads iron_valiant kartana kingambit naganadel pheromosa raging_bolt roaring_moon sandy_shocks scream_tail slither_wing stakataka terrakion ting_lu walking_wake wo_chien xurkitree'.split(' '),
  Gmax: 'alcremie appletun blastiose butterfree centiskorch charizard cinderace coalossal copperajah corviknight duraludon eevee eternatus grimmsnarl gyarados hatterene inteleon lapras machamp melmetal orbeetle pikachu rillaboom sandaconda snorlax toxtricity urshifu venusaur'.split(' '),
}
const starterDetails = {
  'Rare:ogerpon': { name: 'Ogerpon', type: 'Grass', note: 'Legendary mask bearer' },
  'Paradox:iron_valiant': { name: 'Iron Valiant', type: 'Fairy / Fighting', note: 'Area Zero future form' },
  'Gmax:charizard': { name: 'Gigantamax Charizard', type: 'Fire / Flying', note: 'Gmax form' },
}

function titleFromFilename(filename) {
  return filename.replace(/\.png$/i, '').split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const generatedPokemon = Object.entries(spriteFiles).flatMap(([category, filenames]) => filenames.map((filename) => {
  const key = `${category}:${filename}`
  const details = starterDetails[key] || {}
  return { id: key, name: details.name || titleFromFilename(`${filename}.png`), category, number: '', type: details.type || '', note: details.note || '', sprite: `sprites/${category}/${filename}.png` }
}))

const savedPokemon = JSON.parse(localStorage.getItem(storageKey) || 'null') || []
const savedByKey = new Map(savedPokemon.filter((entry) => entry.category !== 'Regional').map((entry) => [`${entry.category}:${entry.name.toLowerCase().replaceAll(' ', '_')}`, entry]))
const generatedKeys = new Set(generatedPokemon.map((entry) => entry.id))
let pokemon = [
  ...generatedPokemon.map((entry) => ({ ...entry, ...(savedByKey.get(entry.id) || {}) , sprite: entry.sprite })),
  ...savedPokemon.filter((entry) => entry.category !== 'Regional' && !generatedKeys.has(`${entry.category}:${entry.name.toLowerCase().replaceAll(' ', '_')}`)),
]
let activeCategory = 'All'
let searchTerm = ''
let editMode = false
let editingId = null
const app = document.querySelector('#app')

function save() {
  localStorage.setItem(storageKey, JSON.stringify(pokemon))
}

function filteredPokemon() {
  return pokemon.filter((entry) => {
    const matchesCategory = activeCategory === 'All' || entry.category === activeCategory
    const haystack = `${entry.name} ${entry.type} ${entry.note} ${entry.number}`.toLowerCase()
    return matchesCategory && haystack.includes(searchTerm.toLowerCase())
  })
}

function render() {
  const visiblePokemon = filteredPokemon()
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="S7 Pokedex home"><span class="brand-mark">S7</span><span>S7 Pokedex</span></a>
        <div class="topbar-actions">
          <span class="private-status"><span class="status-dot"></span>Private catalog</span>
          <button class="owner-button ${editMode ? 'active' : ''}" id="toggle-owner" type="button">${editMode ? 'Exit owner mode' : 'Owner mode'}</button>
        </div>
      </header>
      <main>
        <section class="intro">
          <div>
            <p class="eyebrow">Server reference / 2026 season</p>
            <h1>Find your next <em>rare find.</em></h1>
            <p class="intro-copy">A living field guide for the Pokemon worth remembering on your server.</p>
          </div>
          <div class="collection-count"><strong>${pokemon.length}</strong><span>entries<br>tracked</span></div>
        </section>
        <section class="toolbar" aria-label="Catalog controls">
          <div class="category-tabs">${categories.map((category) => `<button class="tab ${activeCategory === category ? 'selected' : ''}" data-category="${category}" type="button">${category}<span>${category === 'All' ? pokemon.length : pokemon.filter((entry) => entry.category === category).length}</span></button>`).join('')}</div>
          <label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Search the catalog" value="${searchTerm.replaceAll('"', '&quot;')}"></label>
        </section>
        <section class="catalog-heading"><div><p class="eyebrow">Showing ${activeCategory}</p><h2>${visiblePokemon.length} Pokemon</h2></div>${editMode ? '<button class="primary-button" id="new-entry" type="button"><span>+</span> Add Pokemon</button>' : ''}</section>
        <section class="grid" aria-live="polite">${visiblePokemon.length ? visiblePokemon.map(cardTemplate).join('') : emptyTemplate()}</section>
        <p class="storage-note">Sprites are loaded automatically from the <code>sprites/Rare</code>, <code>sprites/Paradox</code>, and <code>sprites/Gmax</code> folders.</p>
      </main>
      <footer><span>S7 POKEDEX</span><span>Catalog · Owner managed</span></footer>
    </div>
    ${editMode && editingId !== null ? formTemplate() : ''}
  `
  bindEvents()
}

function cardTemplate(entry) {
  return `<article class="pokemon-card"><div class="card-top"><span class="category-pill ${entry.category.toLowerCase()}">${entry.category}</span><span class="dex-number">#${entry.number || '----'}</span></div><div class="sprite-frame"><img src="${entry.sprite || ''}" alt="${entry.name} sprite" onerror="this.classList.add('missing'); this.alt='Sprite not added yet'"><span class="missing-label">Sprite pending</span></div><div class="card-info"><h3>${entry.name}</h3><p>${entry.type || 'Type not set'}</p>${entry.note ? `<div class="note">${entry.note}</div>` : ''}</div>${editMode ? `<div class="card-actions"><button type="button" data-edit="${entry.id}">Edit</button><button type="button" class="delete" data-delete="${entry.id}">Delete</button></div>` : ''}</article>`
}

function emptyTemplate() {
  return `<div class="empty-state"><span class="empty-mark">+</span><h3>No Pokemon here yet</h3><p>Switch categories or add your first entry in owner mode.</p></div>`
}

function formTemplate() {
  const entry = pokemon.find((item) => item.id === editingId) || { name: '', category: 'Rare', number: '', type: '', note: '', sprite: '' }
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><div class="modal-header"><div><p class="eyebrow">Owner mode</p><h2 id="form-title">${editingId ? 'Edit entry' : 'Add Pokemon'}</h2></div><button class="close-button" id="close-form" type="button" aria-label="Close">x</button></div><form id="pokemon-form"><label>Pokemon name<input name="name" required value="${entry.name}"></label><div class="form-row"><label>Category<select name="category">${categories.slice(1).map((category) => `<option ${entry.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></label><label>Dex number<input name="number" inputmode="numeric" maxlength="4" value="${entry.number}"></label></div><label>Type or typing<input name="type" placeholder="e.g. Fire / Flying" value="${entry.type}"></label><label>Sprite path<input name="sprite" placeholder="/sprites/pokemon.png" value="${entry.sprite}"></label><label>Note<textarea name="note" rows="3" placeholder="Why is this entry useful on your server?">${entry.note}</textarea></label><div class="form-actions"><button class="secondary-button" id="cancel-form" type="button">Cancel</button><button class="primary-button" type="submit">${editingId ? 'Save changes' : 'Add to catalog'}</button></div></form></section></div>`
}

function bindEvents() {
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { activeCategory = button.dataset.category; render() }))
  document.querySelector('#search')?.addEventListener('input', (event) => { searchTerm = event.target.value; render(); document.querySelector('#search')?.focus() })
  document.querySelector('#toggle-owner')?.addEventListener('click', () => { editMode = !editMode; editingId = null; render() })
  document.querySelector('#new-entry')?.addEventListener('click', () => { editingId = ''; render() })
  document.querySelector('#close-form')?.addEventListener('click', () => { editingId = null; render() })
  document.querySelector('#cancel-form')?.addEventListener('click', () => { editingId = null; render() })
  document.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => { editingId = button.dataset.edit; render() }))
  document.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => { if (confirm('Remove this entry from your catalog?')) { pokemon = pokemon.filter((entry) => entry.id !== button.dataset.delete); save(); render() } }))
  document.querySelector('#pokemon-form')?.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); if (editingId) pokemon = pokemon.map((entry) => entry.id === editingId ? { ...entry, ...data } : entry); else pokemon = [...pokemon, { ...data, id: crypto.randomUUID() }]; save(); editingId = null; render() })
}

render()
