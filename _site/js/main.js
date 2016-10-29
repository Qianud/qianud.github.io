/*-- jQuery Extend --*/
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
        return $(this);
    }
});

/*-- jQuery Core --*/
;(function ($) {

    /*-- Define All Global Variables --*/

    var $window = $(window),
        $document = $(document),
        $exchange = $('.exchange'),
        $close = $('.close-button'),
        $paraBg = $('.work-header-img'),
        $videoWrap = $('.video-wrap'),
        $flowList = $('.flow-list'),
        $gridBorder = $('.grid-border'),
        animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        animationS = true,
        animationE = false,
        position = $window.scrollTop(),
        headerH = $('.header').height() + $('.work-header-img').height();
    

    /*-- Define Functions --*/
    var Events = {

        //Show body content
        ShowBodyContent: function () {

            $('.loading-gif').addClass('hidden');
            $('.header, .wrap').removeClass('hidden');
            Events.ReplaceImg();
            Events.ImagePopUp();

            // Why the List width equals 0
            // var length = $bgImg.length,
            //     count = 0;
            //
            // $bgImg.each(function(){
            //
            //     var $this = $(this),
            //         src = $this.attr('data');
            //         img = new Image(),
            //         img.src = src;
            //
            //     img.onload = function () {
            //         $(this).remove();
            //         $this.css('background-image', src);
            //         count++;
            //
            //         //Show all content
            //         if(count === length){
            //             $('.loading-gif').addClass('hidden');
            //             $('.header, .wrap').removeClass('hidden');
            //         }
            //     }
            //
            // });

        },

        //Replace different imgs for larger screen
        ReplaceImg: function () {

            $('img[data]').each(function () {

                var $this = $(this),
                    src = $this.attr('src'),
                    url = $this.attr('data');

                if ($window.width() >= 768 && $this.hasClass('img-sm')) {

                    var url = $this.data('img-sm');

                }


                if (url == '' || url == src) {
                    return;
                }

                var img = new Image();
                img.src = url;

                if (img.complete) {
                    $this.attr('src', url);
                    return;
                }

                img.onload = function () {
                    $this.attr('src', url);
                }

            });

        },

        //Pop up image
        ImagePopUp: function () {
            $('.popup-link').magnificPopup({
                type: 'image',
                closeOnContentClick: true
            });
        },

        //Header show & hide
        HeaderShowHide: function () {

            var scroll = $window.scrollTop();

            if (scroll > position && position > 45) {

                //only piece that matters
                $('.collapsed')
                    .addClass('down');

            } else {
                //only piece that matters
                $('.collapsed')
                    .removeClass('down');
            }

            position = scroll;
        },

        //HeaderChange change portrait
        HeaderChange: function () {

            if ($window.width() < 768) {

                var $homeHeader = $('.home .header'),
                    heightPart = $homeHeader.height(),
                    top = $window.scrollTop();

                if (top > heightPart) {

                    $homeHeader.addClass('shrink');

                }
                else {

                    $homeHeader.removeClass('shrink');

                }

            }
        },

        //Parallax scolling
        ParallaxScrolling: function (top) {
            // $paraBg.css('top', 65 - (top * 0.75) + 'px');
            top = - top * 0.6;
            $paraBg.css({'transform': 'translate3d(0px, ' + top + 'px, 0px)'});
        },

        //Show & Hide PrevNext buttons
        ShowHideButtons: function () {

            var top = $window.scrollTop();

            if (top > headerH) {

                $('.exchange-nav').css('opacity', 1);

            }
            else {

                $('.exchange-nav').css('opacity', 0);
                Events.ParallaxScrolling(top);

            }

        },

        //ButtonOpacity
        ButtonOpacity: (function (settings) {
            settings = settings || {};

            var lastPos, newPos, timer, delta, opacity,
                delay = settings.delay || 50, // in "ms" (higher means lower fidelity )
                maxSpeed = settings.maxSpeed || 50;

            function clear() {
                lastPos = null;
                delta = 0;
                $exchange.css('opacity', 1);
            }

            clear();

            return function () {
                newPos = window.scrollY;
                if (lastPos != null) { // && newPos < maxScroll
                    delta = newPos - lastPos;
                }
                lastPos = newPos;
                clearTimeout(timer);
                timer = setTimeout(clear, delay);
                delta = Math.abs(delta) > maxSpeed ? maxSpeed : Math.abs(delta);
                opacity = 1 - delta / maxSpeed;
                $exchange.css('opacity', opacity);
            };
        })(),

        // Prev & Next button
        ExpandButtons: function () {

            if (animationS) {

                animationS = false;

                $('.exchange').addClass('hidden');

                $('.close-button').removeClass('hidden')
                    .animateCss('pulse')
                    .one(animationEnd,
                        function (e) {
                            $(this).animateCss('rotateIn');
                        });

                $('.prev').removeClass('hidden')
                    .animateCss('bounceInRightLong')
                    .one(animationEnd,
                        function (e) {
                            $(this).css({transform: "translate3d(-150px, 0, 0)"});
                        });


                $('.next').removeClass('hidden')
                    .animateCss('bounceInRightShort')
                    .one(animationEnd,
                        function (e) {
                            $(this).css({transform: "translate3d(-75px, 0, 0)"});
                            animationE = true;
                        });

            }
        },

        CollapseButtons: function () {

            if (animationE) {

                animationE = false;

                $('.close-button')
                    .animateCss('pulse')
                    .one(animationEnd, function (e) {
                        $(this).animateCss('rotateOut')
                            .one(animationEnd, function (e) {
                                $(this).addClass('hidden');
                                $('.exchange').removeClass('hidden');
                            });
                    });

                $('.prev').animateCss('bounceOutRightLong rotateOut')
                    .one(animationEnd, function (e) {
                        $(this).addClass('hidden');
                        $(this).css({transform: "translate3d(0, 0, 0)"});
                    });

                $('.next').animateCss('bounceOutRightShort rotateOut')
                    .one(animationEnd, function (e) {
                        $(this).addClass('hidden');
                        $(this).css({transform: "translate3d(0, 0, 0)"});
                        animationS = true;
                    });
            }

        },

        //Add grid border
        GridBorder: function () {

            var $td;

            if ($window.width() < 768) {

                $td = "<td></td><td></td><td></td><td></td>";

            }
            else if ($window.width() < 992) {

                $td = "<td></td><td></td><td></td><td></td><td></td>";

            }
            else {

                $td = "<td></td><td></td><td></td><td></td><td></td><td></td><td></td>";

            }

            $gridBorder.find('tr').empty().append($td);

        },

        //Show the ripple effect when click the button
        RippleEffect: function ($self, e) {

            if ($self.closest('[data-ripple]')) {
                e.stopPropagation();
            }

            var initPos = $self.css('position'),
                offs = $self.offset(),
                h = Math.min($self.width(), $self.height(), 160),
                x = e.pageX - offs.left,
                y = e.pageY - offs.top,
                $ripple = $('<div/>', {class: 'ripple', appendTo: $self});

            if (!initPos || initPos === 'static') {
                $self.css({position: 'relative'});
            }

            $('<div/>', {
                class: 'ripple-wave',
                css: {
                    background: $self.data('ripple'),
                    width: h,
                    height: h,
                    left: x - (h / 2),
                    top: y - (h / 2)
                },
                appendTo: $ripple,
                one: {
                    animationEnd: function () {
                        $ripple.remove();
                    }
                }
            });


        },

        //Click to autoplay video
        AutoPlayVideo: function ($self) {
            $self.addClass('play')
                .find('.video-cover').addClass('hidden')
                .end().find('iframe').removeClass('hidden')
                .get(0).src += '?autoplay=1';
        }


    };

    /*-- Bind Events --*/
    $(window).on('load', function () {
        Events.ShowBodyContent();
    });

    $window.on('resize', function () {
        Events.ReplaceImg();
        Events.GridBorder();
    });

    $document.on('mousedown', '[data-ripple]', function (e) {
        Events.RippleEffect($(this), e);
    });

    $window.on('scroll', function () {
        Events.HeaderShowHide();
        Events.HeaderChange();
        Events.ShowHideButtons();
    });

    $exchange.on('click', function () {
        Events.ExpandButtons();
    });

    $close.on('click', function () {
        Events.CollapseButtons();
    });

    $videoWrap.on('click', function () {
        Events.AutoPlayVideo($(this));
    });

    // Events.GridBorder();

    $flowList.slick({dots: true});
    /*-- jQuery End --*/
})(jQuery);
