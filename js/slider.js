const swiper = new Swiper('.swiper-container', {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
    grabCursor: true,
    effect: 'coverflow',
    centeredSlides: true,
    slideToClickedSlide: true,
    initialSlide: 2,

    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1.3,
            spaceBetween: 0
        },
        // when window width is >= 480px
        767: {
            slidesPerView: 2,
            spaceBetween: 10
        },
        // when window width is >= 640px
        1025: {
            spaceBetween: 30,
            slidesPerView: 3,
        }
    },

    coverflowEffect: {
		rotate: 60,
		stretch: 10,
		depth: 50,
		modifier: 1,
		slideShadows: false,
	},

    on: {
        init: () => {
            document.querySelector('.cases__swiper').classList.add('cases__swiper-show')
        },
        click: (swiper, event) => {
            const target = event.target
            if (target.classList.contains('swiper-slide-active'))
                document.querySelector('.cases').classList.add('cases-expanded')
            else if (target.classList.contains('cases__clip_wrap'))
                document.querySelector('.cases').classList.remove('cases-expanded')
        }
    },
})
