(function () {
  var tag = document.currentScript;
  var courseId = tag && tag.dataset.courseId;
  if (courseId !== 'cfo' && courseId !== 'cpa') return;

  var measurementId = 'G-LQGTH0XT3M';
  var item = {
    item_id: courseId,
    item_name: courseId === 'cfo' ? 'מנהל הכספים של העסק שלך' : 'הכסף של העסק בידיים שלך',
    price: 297,
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
  window.gtag('event', 'view_item', { currency: 'ILS', value: 297, items: [item] });

  // The static landing pages bypass the Next.js layout that loads GA4.
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;
    var link = target.closest('a[href^="https://my.schooler.biz/s/"]');
    if (!link) return;

    var placement = 'other';
    if (link.classList.contains('nav-cta')) placement = 'navigation';
    else if (link.classList.contains('btn-pri')) placement = 'hero';
    else if (link.classList.contains('pcard-cta')) placement = 'pricing';
    else if (link.classList.contains('final-cta')) placement = 'final';
    else if (link.classList.contains('sticky-cta')) placement = 'sticky';

    window.gtag('event', 'begin_checkout', {
      currency: 'ILS',
      value: 297,
      items: [item],
      course_id: courseId,
      cta_placement: placement,
      link_url: link.href,
    });
  });
})();
