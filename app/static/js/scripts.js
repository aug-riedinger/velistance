$.backstretch([
  "http://farm9.staticflickr.com/8306/7856635672_cefdd93bd1_b.jpg"
  , "http://farm3.staticflickr.com/2541/4129875543_939a4ba996_o.jpg"
  , "http://farm4.staticflickr.com/3053/3007265056_e4b966bbeb_o.jpg"
  ], {duration: 5000, fade: 750});


jQuery(document).ready(function ($) {

  $('#title').animate({
    'margin-top': $(window).height()*0.5 - $('#title').height()/2,
    'margin-bottom': $(window).height()*0.5
  });

  $(window).stellar();

  var links = $('.navigation').find('li');
  slide = $('.slide');
  button = $('.button');
  mywindow = $(window);
  htmlbody = $('html,body');

  $('#content-beginning').waypoint(function(event, direction) {
    if (direction === 'down') {
      $('header').animate({
        top: 0
      });
    } else {
      $('header').animate({
        top: -80
      });
    }
  });

  slide.waypoint(function (event, direction) {

    dataslide = $(this).attr('data-slide');

    if (direction === 'down') {
      $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');
    }
    else {
      $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');
    }

  });

  // mywindow.scroll(function () {
  //   if (mywindow.scrollTop() == 0) {
  //     $('.navigation li[data-slide="1"]').addClass('active');
  //     $('.navigation li[data-slide="2"]').removeClass('active');
  //   }
  // });

  function goToByScroll(dataslide) {
    console.log($('.slide[data-slide="' + dataslide + '"]').offset().top);
    htmlbody.animate({
      scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top-60
    }, 2000, 'easeInOutQuint');
  }



  links.click(function (e) {
    e.preventDefault();
    dataslide = $(this).attr('data-slide');
    goToByScroll(dataslide);
  });

  button.click(function (e) {
    e.preventDefault();
    dataslide = $(this).attr('data-slide');
    goToByScroll(dataslide);

  });


});