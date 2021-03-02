const $ = query => document.querySelector(query)
const $All = query => document.querySelectorAll(query)
const handleClickPrev = (elem, func) => {
    elem.addEventListener('click', e => {
        e.preventDefault()
        func(e)
    })
}

const changeBrowserLinks = $All('.nav__click')

changeBrowserLinks.forEach(elem => handleClickPrev(elem, (e) => {
    const elem = e.currentTarget
    const browser = elem.getAttribute('data-browser')
    const currentShow = $('.item-active')
    const nextShow = $(`.item[data-browser=${browser}]`)

    changeBrowserLinks.forEach(elem => elem.classList.remove('nav__click-active'))
    elem.classList.add('nav__click-active')

    currentShow.classList.remove('item-active')
    currentShow.classList.add('item-disactive')
    nextShow.classList.add('item-active')

    setTimeout(() => {
        currentShow.classList.remove('item-disactive')
    }, 400)
}))

const downloadLinks = $All('.list__link')
const header = $('.header')

downloadLinks.forEach(elem => {
    elem.addEventListener('mouseenter', e => {
        const width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        if (width <= 1024)
            return

        header.classList.add('header-download')
    })
    elem.addEventListener('mouseleave', e => {
        header.classList.remove('header-download')
    })
})
