const title = document.getElementById('title')
const chord_pic = document.getElementById('chord_pic')
const container = document.querySelector('.container')
const addBtn = document.getElementById('addLine')
const saveBtn = document.getElementById('save')
const printBtn = document.getElementById('print')

const textline1 = document.querySelector('.textline')
const chordEl1 = document.querySelector('.chords-select')

window.onload = setFromLocalStorage()

//enter on a line makes it saved
function addSavedOnEnter(el) {
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            e.target.classList.add('saved')
            e.target.blur()
        }
    })
}

addSavedOnEnter(textline1)

//click on saved line makes it normal
function removeSavedOnClick(el) {
    el.addEventListener('click', (e) => {
        e.target.classList.remove('saved')
    })
}

removeSavedOnClick(textline1)


//chord selection shows pic of the chord
function changeChordPicEvent(el) {
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            chord_pic.innerHTML = ''
            const content = document.createElement('ins')
            content.classList.add('scales_chords_api')
            content.setAttribute('chord', `${e.target.value}`)
            chord_pic.appendChild(content)
            scales_chords_api_onload() // API function
            //also change the position si it fits the input
            const top = e.target.offsetTop
            chord_pic.style.top = `${top+e.target.offsetHeight/2-129/2}px`
            chord_pic.style.left = `${e.target.offsetLeft+100}px`
            chord_pic.classList.remove('hidden')
        }
    })
}

changeChordPicEvent(chordEl1)


//button adds new line
addBtn.addEventListener('click', () => {
    newLine = createLine()
    container.appendChild(newLine)
})

function createLine(t, c) {
    newLine = document.createElement('div')
    newLine.classList.add('line')

    newText = createText(t)
    newChord = createChord(c)

    newLine.appendChild(newText)
    newLine.appendChild(newChord)
    return newLine
}

function createText(t) {
    newText = document.createElement('textarea')
    newText.classList.add('textline')
    newText.placeholder = 'Enter text line'
    if (t) {
        newText.value = t
        newText.classList.add('saved')
    }
    addSavedOnEnter(newText)
    removeSavedOnClick(newText)
    return newText
}

function createChord(c) {
    newChord = document.createElement('input')
    newChord.classList.add('chords-select')
    newChord.placeholder = 'Chord'
    if (c) {
        newChord.value = c
    }
    changeChordPicEvent(newChord)
    return newChord
}


//button saves to localstorage
saveBtn.addEventListener('click', () => {
    localStorage.setItem('title', title.value)
    const lines = getLines()
    const chords = getChords()
    localStorage.setItem('lines', JSON.stringify(lines))
    localStorage.setItem('chords', JSON.stringify(chords))
})

function setFromLocalStorage() {
    if (localStorage.getItem('title')) {
        title.value = localStorage.getItem('title')
    }
    if (localStorage.getItem('lines') && localStorage.getItem('chords')) {
        //remove the single static html input
        document.querySelector('.line').remove()

        const lineCollection = JSON.parse(localStorage.getItem('lines'))
        const chordCollection = JSON.parse(localStorage.getItem('chords'))
        const collection = combineArrays(lineCollection, chordCollection)

        Object.keys(collection).map(function (objectKey, index) {
            const value = collection[objectKey]
            container.appendChild(createLine(objectKey, value))
        });

    }
}

function getLines() {
    const linesToSave = []
    const lines = document.querySelectorAll('.textline')
    lines.forEach(line => {
        linesToSave.push(line.value)
    })
    return linesToSave
}

function getChords() {
    const chordsToSave = []
    const chords = document.querySelectorAll('.chords-select')
    chords.forEach(chord => {
        chordsToSave.push(chord.value)
    })
    return chordsToSave
}

//button prints pdf
window.addEventListener('beforeprint', () => {
    chord_pic.classList.add('hidden')
    document.querySelector('.button-container').classList.add('hidden')
})

window.addEventListener('afterprint', () => {
    chord_pic.classList.remove('hidden')
    document.querySelector('.button-container').classList.remove('hidden')
})

printBtn.addEventListener('click', () => {
    window.print()
})

let d = new Date();
document.getElementById('year').innerText = d.getFullYear();