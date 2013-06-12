jQuery(document).ready(function ($) {
  var photos;

  var probaPhotos = function() {
    var probas = [];
    var probasTotal = 0;
    $.each(photos, function(i, photo) {
      probas.push(photo.love);
      probasTotal += photo.love;
    });

    return function() {
      var rand = Math.random()*probasTotal;
      for (var i=0; i<probas.length; i++) {
        rand -= probas[i];
        if (rand < 0) {
          return i;
        }
      }
      return probas.length -1;
    }
  }

  $.getJSON('/photos', function(data) {
    photos = data;

    photosArray = [];

    $.each(photos, function(i, photo) {
      photosArray.push(photo.url);
    });

    var getPhoto = probaPhotos();

    var bs = $.backstretch(photosArray, {fade: 2000}).pause();

    function changePhoto() {
      setTimeout(changePhoto, 8000);
      var photoNb = getPhoto();
      var photo = photos[photoNb];
      $('#count').html(photo.love);
      $('#love').data('url', photo.url);
      $('#flag').data('url', photo.url);
      if (!photo.loved) {
        $('#love').removeClass('done');
      } else {
        $('#love').addClass('done');
      }
      if (!photo.flagged) {
        $('#flag').removeClass('done');
      } else {
        $('#flag').addClass('done');
      }
      return bs.show(photoNb);
    }
    changePhoto();
  });

  $('form').on('submit', function(e) {
    var notice = $(this).find('.notice');

    var regex = new RegExp('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'i');
    if(!regex.test($(this).find('input[type="text"]').val())){
      notice.html('Ceci n\'est pas une URL. Doit être au format http:\/\/site.com\/[...]');
    } else {
      notice.html('Envoi en cours');
      $.ajax({
        type: 'POST',
        url: '/photos',
        data: $(this).serialize(),
        success: function(data) {
          console.log(data);
          notice.html('Lien envoyé avec succès');
        },
        error: function(err) {
          console.log(err);
          if(err.status === 406) {
            notice.html('L\'URL n\'a pas le bon format. Il ne s\'agit pas d\'une image.');
          } else {
            notice.html('Une erreur est survenue. Merci de réessayer');
          }
        }
      });

    }
    e.preventDefault();
    return false;
  });

  $('#love').click(function(e) {
    var that = $(this)

    for (var i=0; i<photos.length; i++) {
      if (photos[i].url == that.data('url')) {
        photo = photos[i];
        break;
      }
    }

    if (!photo.loved) {

      that.addClass('current');
      $.ajax({
        type: 'POST',
        url: '/love',
        data: 'url='+that.data('url'),
        success: function(data) {
          that.removeClass('current');
          that.addClass('done');
          that.prev().html(parseInt(that.prev().html())+1);
          photo.loved = true;
        },
        error: function(err) {
          console.log('Une erreur est survenue.');
        }
      });
    }
  });

  $('#flag').click(function(e) {
    var that = $(this)

    for (var i=0; i<photos.length; i++) {
      if (photos[i].url == that.attr('data-url')) {
        photo = photos[i];
        break;
      }
    }

    if (!photo.flagged) {
      that.addClass('current');
      $.ajax({
        type: 'POST',
        url: '/flag',
        data: 'url='+that.attr('data-url'),
        success: function(data) {
          that.removeClass('current');
          that.addClass('done');
          photo.flagged = true;
        },
        error: function(err) {
          console.log('Une erreur est survenue.');
        }
      });
    }
  });

  setTimeout(function() {
    $('#title').animate({
      'margin-top': $(window).height()*0.5 - $('#title').height()/2,
      'margin-bottom': $(window).height()*0.5
    });
  }, 1000);

  $('#content-beginning').waypoint(function(direction) {
    if (direction === 'down') {
      $('header').animate({
        top: 0
      });
    } else {
      $('header').animate({
        top: -100
      });
    }
  });

  $('.slide').find('.anchor').waypoint(function (direction) {
    dataslide = $(this).parents('.slide').attr('data-slide');
    if (direction === 'down') {
      $('.navigation li').removeClass('active');
      $('.navigation li[data-slide="' + dataslide + '"]').addClass('active');
    }
  }, {
    offset: 250
  }).waypoint(function (direction) {
    if (direction === 'up') {
      dataslide = $(this).parents('.slide').attr('data-slide');
      $('.navigation li').removeClass('active');
      $('.navigation li[data-slide="' + dataslide + '"]').addClass('active');
    }
  }, {
    offset: 100
  });

  function goToByScroll(dataslide) {
    if(dataslide == 0) {
      return $('html,body').animate({
        scrollTop: 0
      }, 2000, 'easeInOutQuint');
    } else {
      return $('html,body').animate({
        scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top-60
      }, 2000, 'easeInOutQuint');
    }
  }

  $('.innerLink').click(function (e) {
    e.preventDefault();
    dataslide = $(this).attr('data-slide');
    goToByScroll(dataslide);
  });

});