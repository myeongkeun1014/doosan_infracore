import { onNavigationListHover, onNavigationItemHover, onSearchClick, onI18nClick, onDescriptionContainerHover, onBottomSelectBoxClick } from './interaction';
import { initSlick } from './doosan-description-slider';
import { initInformationSlick } from './doosan-information-slider';

$(function() {
  const mainSwiperClassName = '.main_slick_container .slick_item';
  const mainSwiperNavigationItemClassName = '.main_slick_container .navigation_item';
  const mainSwiperNavigationButtonClassName = '.main_slick_container .navigation_button';

  let isMainSwiperPause = false;

  // Note that this event should be defined before initializing the slider.
  $(mainSwiperClassName).on('init', function(event, slick) {
    $('.main_slick_container .navigation_item').first().addClass('active');
  });

  $(mainSwiperClassName).slick({
    dots: false,
    arrows: false,
    infinite: true,
    touchMove: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplay: true,
    autoplaySpeed: 8000,
  });

  $(mainSwiperNavigationItemClassName).each(function(idx) {
    $(this).on('click', function(event) {
      $(mainSwiperClassName).slick('slickGoTo', idx);
    });
  });

  $(mainSwiperNavigationButtonClassName).on('click', function(event) {
    isMainSwiperPause = !isMainSwiperPause;

    if (isMainSwiperPause) {
      $(mainSwiperClassName).slick('slickPause');
    } else {
      $(mainSwiperClassName).slick('slickPlay');
    }
    $(this).children().each(function(idx) {
      $(this).toggleClass('active');
    });
  });

  $(mainSwiperClassName).on('afterChange', function(event, slick, direction) {
    $('.main_slick_container .navigation_item').each(function(idx) {
      if (idx === direction) {
        $(this).addClass('active');
        return;
      } 
      $(this).removeClass('active');
    });
  });

  onNavigationListHover();
  onNavigationItemHover();
  onSearchClick();
  onI18nClick();
  onDescriptionContainerHover();

  initSlick();
  initInformationSlick();

  onBottomSelectBoxClick();
});