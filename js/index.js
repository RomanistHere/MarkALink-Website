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
    gameAnimDelayTime: 3500,
    markALinkTogglerText: false,
    winDataIndex: Math.floor(Math.random() * 10) + 1,
    isGameFinished: false,
    gameTimer: null,
    gameRef: null,
    aboutRef: null,
    casesRef: null,
    plansRef: null,
    shouldRetype: true,
}
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

        animateGameGlitch()
    })

    elem.addEventListener('mouseleave', e => {
        const dataIndex = e.currentTarget.getAttribute('data-index')
        const hoveredCells = $All('.game__cell_wrap-hover')

        hoveredCells.forEach(item => item.classList.remove('game__cell_wrap-hover'))

        if (state.gameTimer) {
            clearTimeout(state.gameTimer)
            state = { ...state, gameTimer: null }
        }

        makeGameGlitchAvail()
    })
})

const rightAnswer = dataIndex => {
    const gameCells = $All(`.game__cell_wrap[data-index="${dataIndex}"]`)
    gameCells.forEach(elem => {
        elem.classList.add('game__cell_wrap-right')
    })
    state = { ...state, isGameFinished: true }
    initTyping(gameTyping, 'Success!', 'gameRef', true)
    if (state.markALinkTogglerText)
        handleGameToggleClick()

    // update text of header for future
    $All('.gameTyping').forEach(elem => elem.setAttribute('data-text', 'Download MarkALink'))
    setTimeout(() => { initTyping($All('.gameTyping'), 'Download MarkALink', 'gameRef', true) }, 5000)
}

const wrongAnswer = dataIndex => {
    const gameCells = $All(`.game__cell_wrap[data-index="${dataIndex}"]`)
    initTyping(gameTyping, 'Wrooooong!', 'gameRef', true)
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
}

const animateGameGlitch = () => {
    if (state.gameAnimDelay)
        return

    const animClass = Math.random() < 0.5 ? 'anim-1' : 'anim-2'
    gameSection.classList.add(animClass)
    state = { ...state, gameAnimDelay: true }

    makeGameGlitchAvail()
}

const makeGameGlitchAvail = () => {
    state = {
        ...state,
        gameTimer: setTimeout(() => {
            gameSection.classList.remove('anim-1', 'anim-2')
            state = { ...state, gameAnimDelay: false }
        }, state.gameAnimDelayTime)
    }
}

const animateTextGlitch = () => {

}

const animateSection = section => {
    const typing = section.querySelector('.typing')

    if (typing) {
        const timeoutRef = typing.getAttribute('data-ref')
        const text = typing.getAttribute('data-text')
        const typings = section.querySelectorAll('.typing')

        initTyping(typings, text, timeoutRef, state.shouldRetype)
    }

    if (section.classList.contains('game')) {
        setTimeout(animateGameGlitch, 500)
    } else if (section.classList.contains('about')) {
        setTimeout(animateTextGlitch, 500)
    }
}

const deAnimateSection = section => {
    const typing = section.querySelector('.typing')

    if (typing) {
        const timeoutRef = typing.getAttribute('data-ref')
        const text = typing.getAttribute('data-text')

        typing.textContent = text
        clearTimeout(state[timeoutRef])
        state = { ...state, [timeoutRef]: setTimeout(() => { state = { ...state, [timeoutRef]: null } }, 3000) }
    }
}

const animateOnScroll = () => {
    const animationObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
            const isAppearing = entry.isIntersecting
            const elem = entry.target

            if (isAppearing) {
                animateSection(elem)
            } else {
                deAnimateSection(elem)
            }
        }
    }, {
        // fix for 100vh sections
        threshold: .05
    })

    for (const element of $All('.section_to_animate')) {
        animationObserver.observe(element)
    }
}

const initPassiveInteractive = () => {
    animateOnStart()
    animateOnScroll()

    setTimeout(() => {
        state = { ...state, shouldRetype: false }
    }, 3000)
}

window.addEventListener('load', () => {
    initPassiveInteractive()
}, false)
