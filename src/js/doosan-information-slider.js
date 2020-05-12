export const initInformationSlick = () => {
  $('.doosan_information .slick_container').slick({
    dots: false,
    infinite: true,
    touchMove: true,
    speed: 750,

    // slidesToShow: 4,
    // slidesToScroll: 4,
    variableWidth: true,

    arrows: true,
    prevArrow: '.doosan_information .prev',
    nextArrow: '.doosan_information .next',

  });

  $('.doosan_information .slick_container').on('beforeChange', function(event, slick, direction) {
    console.log({ slick, direction })

    slick.$slides.removeClass('prev_slide');

    slick.$slides.each(function(idx) {
      const $slide = $(slick.$slides[idx]);
      
      if ($slide.hasClass('slick-current')) {
        $slide.addClass('prev_slide');
      }

    });
  });
}