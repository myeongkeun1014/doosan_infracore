import { fromEvent, Subject } from 'rxjs';
const isHovered$ = new Subject(false);
const isLinkListActive$ = new Subject(false);
const isNavigationSearchActive$ = new Subject(false);

const isI18nSelectActive$ = new Subject(false);

isHovered$.subscribe({
  next: (isHovered) => {
    const backdropElement = document.querySelector('.backdrop');
    if (isHovered) {
      backdropElement.classList.add('active');
    } else {
      backdropElement.classList.remove('active');
      isNavigationSearchActive$.next(false);
      isLinkListActive$.next(false);
    }
  }
});

isLinkListActive$.subscribe({
  next: (isLinkListActive) => {
    const hoverNavigationElement = document.querySelector('.hover_navigation_container');
    if (isLinkListActive) {
      isNavigationSearchActive$.next(false);
      hoverNavigationElement.classList.add('active');
    } else {
      hoverNavigationElement.classList.remove('active');
    }
  }
});

isNavigationSearchActive$.subscribe({
  next: (isNavigationSearchActive) => {
    const searchWrapElement = document.querySelector('.middle_navigation .search_wrap');
    if (isNavigationSearchActive) {
      isLinkListActive$.next(false);
      searchWrapElement.classList.add('active');
    } else {
      searchWrapElement.classList.remove('active');
      
    }

  }
});

isI18nSelectActive$.subscribe({
  next: (i18n) => {
    const selectWrap = document.querySelector('.i18n .select_wrap');
    if (i18n) {
      selectWrap.classList.add('active');
    } else {
      selectWrap.classList.remove('active');
    }
  }
});

export const onNavigationListHover = () => {
  const navigationList = document.querySelector('.middle_navigation');
  const hoverListElement = document.querySelector('.middle_navigation .navigation_list');
  let timeoutEvent;
  fromEvent(hoverListElement, 'mouseenter')
    .subscribe(event => {
      clearTimeout(timeoutEvent);
      isHovered$.next(true);
      timeoutEvent = setTimeout(() => {
        isLinkListActive$.next(true);
      }, 250);
    });

  fromEvent(navigationList, 'mouseleave').subscribe(() => {
    clearTimeout(timeoutEvent);
    isLinkListActive$.next(false);
    isHovered$.next(false);
  });
}

export const onNavigationItemHover = () => {
  const items = document.querySelectorAll('.middle_navigation .navigation_list > .item');
  const items2 = document.querySelectorAll('.hover_navigation_container > .item_wrap');
  for (const item of items) {
    fromEvent(item, 'mouseenter').subscribe(() => {
      item.classList.add('active');
    });
    fromEvent(item, 'mouseleave').subscribe(() => {
      item.classList.remove('active');
    });
  }

  for (const item of items2) {
    fromEvent(item, 'mouseenter').subscribe(() => {
      const dataIndex = item.dataset.itemIndex;
      const element = document.querySelector(`.middle_navigation .navigation_list > .item[data-item-index="${dataIndex}"]`);
      element.classList.add('active');
    });
    fromEvent(item, 'mouseleave').subscribe(() => {
      const dataIndex = item.dataset.itemIndex;
      const element = document.querySelector(`.middle_navigation .navigation_list > .item[data-item-index="${dataIndex}"]`);
      element.classList.remove('active');
    });
  }
}

export const onSearchClick = () => {
  const searchButtonElement = document.querySelector('.middle_navigation aside .search');
  const searchWrapElement = document.querySelector('.middle_navigation .search_wrap');
  const searchButtonClick$ = fromEvent(searchButtonElement, 'click');
  let timeoutEvent;

  searchButtonClick$
    .subscribe((event) => {
      clearTimeout(timeoutEvent);
      if (event.target.classList.value.includes('active')) {
        event.target.classList.remove('active')
        isHovered$.next(false);
        isNavigationSearchActive$.next(false);
        timeoutEvent = setTimeout(() => {
          searchWrapElement.classList.remove('active');
        }, 1000);
      } else {
        event.target.classList.add('active')
        isHovered$.next(true);
        isNavigationSearchActive$.next(true);
        timeoutEvent = setTimeout(() => {
          searchWrapElement.classList.add('active');
        }, 1000)
      }
    });
}

export const onI18nClick = () => {
  const i18nElement = document.querySelector('.i18n');
  const i18nSelectItem = document.querySelectorAll('.i18n .select_wrap p');

  fromEvent(i18nElement, 'click')
    .subscribe(event => {
      isI18nSelectActive$.next(true);
  });

  for (const item of i18nSelectItem) {
    fromEvent(item, 'click')
      .subscribe(event => {
        event.stopPropagation();
        isI18nSelectActive$.next(false);
    });
  }

  fromEvent(document, 'click')
    .subscribe(event => {
      const isClickInside = i18nElement.contains(event.target);
      if (!isClickInside) {
        isI18nSelectActive$.next(false);
      }
    })
}


export const onDescriptionContainerHover = () => {
  const descriptionContainer = document.querySelectorAll('.description_container');

  for(const container of descriptionContainer) {
    fromEvent(container, 'mouseenter')
      .subscribe(event => {
        event.target.classList.add('active');
    });

    fromEvent(container, 'mouseleave')
    .subscribe(event => {
      event.target.classList.remove('active');
  });
  }
}


export const onBottomSelectBoxClick = () => { 
  const bottomSelectBox = document.querySelector('.description_nav .sites');
  const bottomSelectList = document.querySelector('.description_nav .sites_select_box');

  let bodySubscribe = null;

  fromEvent(bottomSelectBox, 'click')
    .subscribe(event => {
      const isAddActive = bottomSelectBox.classList.toggle('active');
      if (isAddActive) {
        bodySubscribe = fromEvent(document, 'click')
          .subscribe(event => {
            const isInsideClick = bottomSelectBox.contains(event.target) || bottomSelectList.contains(event.target);
            if (!isInsideClick) {
              bodySubscribe.unsubscribe();
              bottomSelectBox.classList.remove('active');
              bottomSelectList.classList.remove('active');
            }
          });
        bottomSelectList.classList.add('active');
      } else {
        bottomSelectList.classList.remove('active');
      }
    });
}