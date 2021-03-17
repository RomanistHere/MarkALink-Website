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

const browser = (function() {
    const test = function(regexp) {return regexp.test(window.navigator.userAgent)}
    switch (true) {
        case test(/edg/i): return "Microsoft Edge";
        case test(/trident/i): return "Microsoft Internet Explorer";
        case test(/firefox|fxios/i): return "Mozilla Firefox";
        case test(/opr\//i): return "Opera";
        case test(/ucbrowser/i): return "UC Browser";
        case test(/samsungbrowser/i): return "Samsung Browser";
        case test(/chrome|chromium|crios/i): return "Google Chrome";
        case test(/safari/i): return "Apple Safari";
        default: return "Other";
    }
})();

if (browser === "Mozilla Firefox" || browser === "Apple Safari") {
    $('.section').classList.add('weakPerf')
}
