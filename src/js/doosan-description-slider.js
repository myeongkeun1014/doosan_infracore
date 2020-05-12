export const initSlick = () => {
  $('.doosan_description .slick_container .items').slick({
    dots: false,
    infinite: true,
    touchMove: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',

    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: '.doosan_description .slick_container .prev',
    nextArrow: '.doosan_description .slick_container .next',
  });

  $('.doosan_description .slick_container .items').on('afterChange', function(event, slick, direction) {
    $('.doosan_description .button_navigation .dot').each(function(idx) {
      if (idx === direction) {
        $(this).addClass('active');
        return;
      } 
      $(this).removeClass('active');
    });
  });

  $('.doosan_description .button_navigation .dot').each(function(idx) {
    $(this).on('click', function(event) {
      $('.doosan_description .slick_container .items').slick('slickGoTo', idx);
    });
  });
}