const $ = query => document.querySelector(query)
const handleClickPrev = (elem, func) => {
    elem.addEventListener('click', e => {
        e.preventDefault()
        func(e)
    })
}


const gameToggleBtn = $('.gameToggleBtn')
const gameSection = $('.game')
const toggleText = document.querySelectorAll('.glitch_base')
const handleGameToggleClick = () => {
    const toggleNewText = gameToggleBtn.textContent === 'OFF' ? 'ON' : 'OFF'
    toggleText.forEach(item => item.textContent = toggleNewText)
    gameSection.classList.toggle('success')
}

handleClickPrev(gameToggleBtn, handleGameToggleClick)
