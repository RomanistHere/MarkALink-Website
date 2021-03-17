try {
    const swiper = new Swiper('.swiper-container', {
        // loop: true,
        speed: 400,
        spaceBetween: 30,
        slidesPerView: 3,
        grabCursor: true,
        effect: 'coverflow',
        centeredSlides: true,
        slideToClickedSlide: true,
        // initialSlide: 5,
        initialSlide: 1,
        a11y: true,
        // lazy
        preloadImages: false,
        watchSlidesVisibility: true,
        lazy: {
           // loadPrevNext: true,
           // loadPrevNextAmount: 10,
           // loadOnTransitionStart: true
        },

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
    		rotate: 50,
    		stretch: 10,
    		depth: 50,
    		modifier: 1,
    		slideShadows: false,
    	},

        on: {
            init: () => {
                document.querySelector('.cases__swiper').classList.add('cases__swiper-show')
                setTimeout(() => {
                    document.querySelector('.cases__swiper').classList.remove('cases__swiper-show')
                }, 1500)
            },
            click: (swiper, event) => {
                const target = event.target
                if (target.classList.contains('swiper-slide-active')) {
                    document.querySelector('.cases').classList.add('cases-expanded')
                    // document.querySelector('.game-unique').classList.add('game-dark')
                } else if (target.classList.contains('cases__clip_wrap')) {
                    document.querySelector('.cases').classList.remove('cases-expanded')
                    // document.querySelector('.game-unique').classList.remove('game-dark')
                }

                try {
                    startMusic()
                } catch (e) {
                    // not loaded
                }
            }
        },
    })
} catch (e) {}
