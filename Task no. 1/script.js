$(document).ready(function () {
  var $slider = $(".slick-wrapper");

  // Remember each image's original (desktop) src once, before any swapping,
  // so resizing back and forth never loses it or writes "undefined".
  function rememberDesktopSrc($imgs) {
    $imgs.each(function () {
      var $img = $(this);
      if (!$img.attr("data-desktop-src")) {
        $img.attr("data-desktop-src", $img.attr("src"));
      }
    });
  }
  rememberDesktopSrc($slider.find("img"));

  $slider.slick({
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 1000,
    draggable: true,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  function updateImagesForMobile() {
    var isMobile = window.matchMedia("(max-width: 992px)").matches;

    // Query the whole wrapper so any slides cloned by slick are handled too.
    var $imgs = $slider.find("img");
    rememberDesktopSrc($imgs);

    $imgs.each(function () {
      var $img = $(this);
      var desktopSrc = $img.attr("data-desktop-src");
      var mobileSrc = $img.attr("data-mobile-src");
      var target = isMobile && mobileSrc ? mobileSrc : desktopSrc;

      if (target && $img.attr("src") !== target) {
        $img.attr("src", target);
      }
    });
  }

  updateImagesForMobile();
  $(window).on("resize", updateImagesForMobile);
});
