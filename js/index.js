const $ = query => document.querySelector(query)
const $All = query => document.querySelectorAll(query)
const handleClickPrev = (elem, func) => {
    elem.addEventListener('click', e => {
        e.preventDefault()
        func(e)
    })
}
const customScrollTo = (to, duration) => {
    const start = 0
    const change = to - start
    let currentTime = 0
    const increment = 20

    const animateScroll = () => {
        currentTime += increment
        const val = easeInOutQuad(currentTime, start, change, duration)
        window.scrollTo(0, val)

        if (currentTime < duration)
            setTimeout(animateScroll, increment)
    }
    animateScroll()
}
const easeInOutQuad = (t, b, c, d) => {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
}

let state = {
    gameAnimDelay: false,
    markALinkTogglerText: false,
    winDataIndex: Math.floor(Math.random() * 10) + 1,
    isGameFinished: false,
    gameTypingTimeout: null,
    aboutRef: null,
    casesRef: null,
    plansRef: null,
    shouldRetype: true,
}
let gameTimer = null
const gameToggleBtn = $('.gameToggleBtn')
const gameSection = $('.game-unique')
const toggleText = $All('.glitch_base')
const gameCellsUniq = $All('.game__field-unique .game__cell_wrap')
const gameTyping = $All('.gameTyping')
const aboutTyping = $All('.aboutTyping')

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
    // initTyping(gameTyping, 'Success!', 'gameTypingTimeout')
    toggleGameField(false)
}

const wrongAnswer = dataIndex => {
    const gameCells = $All(`.game__cell_wrap[data-index="${dataIndex}"]`)
    // initTyping(gameTyping, 'Wrooooong!', 'gameTypingTimeout')
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

const initTyping = (elems, txt = '', timeoutRef, shouldRetype = state.shouldRetype) => {
    if (!shouldRetype && Boolean(state[timeoutRef]))
        return

    const speed = 100
    let i = 0

    const typeWriter = () => {
        if (i < txt.length) {
            elems.forEach(item => item.textContent += txt.charAt(i))
            i++
            if (txt.charAt(i) == ' ') {
                typeWriter()
            } else {
                state = { ...state, [timeoutRef]: setTimeout(typeWriter, speed) }
            }
        } else {
            clearTimeout(state[timeoutRef])
            state = { ...state, [timeoutRef]: null }
        }
    }

    if (state[timeoutRef]) {
        clearTimeout(state[timeoutRef])
        state = { ...state, [timeoutRef]: null }
    }

    elems.forEach(item => item.textContent = '')
    typeWriter()
}

const animateOnStart = () => {
    const scrollToString = window.location.hash.substr(1)
    if (!scrollToString)
        return
    const scrollToElem = $(`.${scrollToString}`)
    if (!scrollToElem)
        return

    const scrollToDist = scrollToElem.getBoundingClientRect().top
    customScrollTo(scrollToDist, Math.floor(scrollToDist / 2))

    // setTimeout(() => {
    //     animateGlitch()
    // }, 500)
}

const animateGlitch = () => {
    if (state.gameAnimDelay)
        return

    const animClass = Math.random() < 0.5 ? 'anim-1' : 'anim-2'
    gameSection.classList.add(animClass)
    state = { ...state, gameAnimDelay: true }
}

const animateOnScroll = () => {
    const animationObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
            const isAppearing = entry.isIntersecting
            const elem = entry.target
            const timeoutRef = elem.getAttribute('data-ref')
            const text = elem.getAttribute('data-text')

            if (isAppearing) {
                initTyping([elem], text, timeoutRef, state.shouldRetype)
            } else {
                elem.textContent = text
                clearTimeout(state[timeoutRef])
                state = { ...state, [timeoutRef]: setTimeout(() => { state = { ...state, [timeoutRef]: null } }, 3000) }
            }
        }
    })

    for (const element of $All('.typing')) {
        animationObserver.observe(element)
    }
}

const initPassiveInteractive = () => {
    animateOnStart()

    animateOnScroll()

    // initTyping(gameTyping, 'Find a good cell.', 'gameTypingTimeout')

    setInterval(() => {
        if (state.gameTypingTimeout)
            return
        // initTyping(gameTyping, state.isGameFinished ? 'Download MarkALink!' : 'Find a good cell.', 'gameTypingTimeout')
    }, 20000)

    setInterval(() => {
        animateGlitch()
    }, 30000)

    setTimeout(() => {
        state = { ...state, shouldRetype: false }
    }, 3000)

    // initTyping(aboutTyping, 'So, what is it all about?', 'aboutTypingTimeout')
}



window.addEventListener("load", () => {
    initPassiveInteractive()
}, false)
