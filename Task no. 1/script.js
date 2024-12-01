$(document).ready(function () {
    $(".slick-wrapper").slick({
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
      const isMobile = window.matchMedia("(max-width: 992px)").matches;
  
      $(".slick-slide img").each(function () {
        const desktopSrc = $(this).attr("src");
        const mobileSrc = $(this).data("mobile-src");
  
        if (isMobile) {
          // Swap to mobile image
          $(this).attr("src", mobileSrc);
        } else {
          // Revert to desktop image
          $(this).attr("src", desktopSrc);
        }
      });
    }
  
    // Initial check
    updateImagesForMobile();
  
    // Re-check on window resize
    $(window).on("resize", updateImagesForMobile);
  });
  
  
