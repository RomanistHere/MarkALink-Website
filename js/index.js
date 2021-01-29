const $ = query => document.querySelector(query)
const handleClickPrev = (elem, func) => {
    elem.addEventListener('click', e => {
        e.preventDefault()
        func(e)
    })
}


const gameToggleBtn = $('.gameToggleBtn')
const gameSection = $('.game-unique')
const toggleText = document.querySelectorAll('.glitch_base')
const handleGameToggleClick = () => {
    const toggleNewText = gameToggleBtn.textContent === 'OFF' ? 'ON' : 'OFF'
    toggleText.forEach(item => item.textContent = toggleNewText)
    gameSection.classList.toggle('success')
}

handleClickPrev(gameToggleBtn, handleGameToggleClick)

let gameTimer = null
const gameCellsUniq = document.querySelectorAll('.game__field-unique .game__cell_wrap')
gameCellsUniq.forEach(elem => {
    elem.addEventListener('mouseenter', e => {
        const dataIndex = e.currentTarget.getAttribute('data-index')
        const gameCells = document.querySelectorAll(`.game__cell_wrap[data-index="${dataIndex}"]`)
        gameCells.forEach(item => item.classList.add('game__cell_wrap-hover'))

        gameSection.classList.add('anim-1')
    })

    elem.addEventListener('mouseleave', e => {
        const dataIndex = e.currentTarget.getAttribute('data-index')
        const hoveredCells = document.querySelectorAll('.game__cell_wrap-hover')
        hoveredCells.forEach(item => item.classList.remove('game__cell_wrap-hover'))

        if (gameTimer) {
            clearTimeout(gameTimer)
            gameTimer = null
        }

        gameTimer = setTimeout(() => {
            gameSection.classList.remove('anim-1')
        }, 2500)
    })
})
