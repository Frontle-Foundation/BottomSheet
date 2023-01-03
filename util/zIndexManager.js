const findHighestZIndex = element => {
  const els = [...document.querySelectorAll(`${element} *`)];
  let maxZindex = 1;

  els.forEach(el => {
    let zIndex = document.defaultView.getComputedStyle(el, null).getPropertyValue('z-index');
    if (!isNaN(zIndex)) {
      zIndex = Number(zIndex);
      maxZindex = maxZindex < zIndex ? zIndex : maxZindex;
    }
  });

  return Number(maxZindex);
};

export {findHighestZIndex};
