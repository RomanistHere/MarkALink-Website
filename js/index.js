const $ = query => document.querySelector(query)
const $All = query => document.querySelectorAll(query)
const handleClickPrev = (elem, func) => {
    elem.addEventListener('click', e => {
        e.preventDefault()
        func(e)
    })
}

let state = {
    gameAnimDelay: false,
    markALinkTogglerText: false,
    winDataIndex: Math.floor(Math.random() * 10) + 1,
    isGameFinished: false,
    gameTypingTimeout: null,
}
let gameTimer = null
const gameToggleBtn = $('.gameToggleBtn')
const gameSection = $('.game-unique')
const toggleText = $All('.glitch_base')
const gameCellsUniq = $All('.game__field-unique .game__cell_wrap')
const gameTyping = $All('.gameTyping')

const handleGameToggleClick = () => {
    const toggleNewText = state.markALinkTogglerText ? 'OFF' : 'ON'
    toggleText.forEach(item => item.textContent = toggleNewText)
    gameSection.classList.toggle('success')
    state = { ...state, markALinkTogglerText: !state.markALinkTogglerText }

    toggleGameField(state.markALinkTogglerText)
}

const toggleGameField = shouldHide => {
    const gameCells = $All('.game__cell_wrap')
    gameCells.forEach(elem => {
        if (shouldHide) {
            const dataIndex = elem.getAttribute('data-index')
            if (dataIndex != state.winDataIndex) {
                elem.classList.add('game__cell_wrap-hide')
            }
        } else {
            elem.classList.remove('game__cell_wrap-hide')
        }
    })
}

handleClickPrev(gameToggleBtn, handleGameToggleClick)

gameCellsUniq.forEach(elem => {
    elem.addEventListener('mouseenter', e => {
        const dataIndex = e.currentTarget.getAttribute('data-index')
        const gameCells = $All(`.game__cell_wrap[data-index="${dataIndex}"]`)
        gameCells.forEach(item => item.classList.add('game__cell_wrap-hover'))

        if (!state.gameAnimDelay) {
            const animClass = Math.random() < 0.5 ? 'anim-1' : 'anim-2'
            gameSection.classList.add(animClass)
            state = { ...state, gameAnimDelay: true }
        }
    })

    elem.addEventListener('mouseleave', e => {
        const dataIndex = e.currentTarget.getAttribute('data-index')
        const hoveredCells = $All('.game__cell_wrap-hover')
        hoveredCells.forEach(item => item.classList.remove('game__cell_wrap-hover'))

        if (gameTimer) {
            clearTimeout(gameTimer)
            gameTimer = null
        }

        gameTimer = setTimeout(() => {
            gameSection.classList.remove('anim-1', 'anim-2')
            state = { ...state, gameAnimDelay: false }
        }, 3500)
    })
})

const rightAnswer = dataIndex => {
    const gameCells = $All(`.game__cell_wrap[data-index="${dataIndex}"]`)
    gameCells.forEach(elem => {
        elem.classList.add('game__cell_wrap-right')
    })
    state = { ...state, isGameFinished: true }
    initTyping(gameTyping, 'Success!')
    toggleGameField(false)
}

const wrongAnswer = dataIndex => {
    const gameCells = $All(`.game__cell_wrap[data-index="${dataIndex}"]`)
    initTyping(gameTyping, 'Wrooooong!')
    gameCells.forEach(elem => {
        elem.classList.add('game__cell_wrap-wrong')
        setTimeout(() => {
            elem.classList.remove('game__cell_wrap-wrong')
        }, 3000)
    })
}

const cellClick = e => {
    if (state.isGameFinished)
        return

    const elem = e.currentTarget
    const dataIndex = elem.getAttribute('data-index')
    if (dataIndex == state.winDataIndex) {
        rightAnswer(dataIndex)
    } else {
        wrongAnswer(dataIndex)
    }
}

const initGame = () => {
    const gameCells = $All('.game__cell_wrap')

    gameCells.forEach(elem => handleClickPrev(elem, cellClick))
}

initGame()

const initTyping = (elem, txt) => {
    const speed = 100
    let i = 0

    const typeWriter = () => {
        if (i < txt.length) {
            elem.forEach(item => item.textContent += txt.charAt(i))
            i++
            if (txt.charAt(i) == ' ') {
                typeWriter()
            } else {
                state = { ...state, gameTypingTimeout: setTimeout(typeWriter, speed) }
            }
        } else {
            clearTimeout(state.gameTypingTimeout)
            state = { ...state, gameTypingTimeout: null }
        }
    }

    if (state.gameTypingTimeout) {
        clearTimeout(state.gameTypingTimeout)
        state = { ...state, gameTypingTimeout: null }
    }

    elem.forEach(item => item.textContent = '')
    typeWriter()
}

const initPassiveInteractive = () => {
    initTyping(gameTyping, 'Find a good cell.')
    
    setInterval(() => {
        if (state.gameTypingTimeout)
            return
        initTyping(gameTyping, 'Find a good cell.')
    }, 20000)

    setInterval(() => {
        if (state.gameAnimDelay)
            return

        const animClass = Math.random() < 0.5 ? 'anim-1' : 'anim-2'
        gameSection.classList.add(animClass)
        state = { ...state, gameAnimDelay: true }
    }, 30000)
}

initPassiveInteractive()
