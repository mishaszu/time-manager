app.directive('timeline', function(){
  return {
    restrict: 'E',
    scope: {
      data: "="
    },
    templateUrl: "directives/timeline.directives.html",
    link: function(scope, element, attr) {
      var ww = window.innerWidth,
          maxW = 2400,
          time = new Date(),
          hour = time.getHours(),
          minutes = time.getMinutes(),
          currentMargin = 0,
          element = document.getElementsByClassName('tl')[0];

      element.style.marginLeft = -1 * ( (hour - 1) * 100) + (ww / 2) - ((minutes*100)/60) + "px";

      var interval = setInterval(addMargin, 60000);
      
      function addMargin() {
        var time = new Date(),
        hour = time.getHours(),
        minutes = time.getMinutes();
        element.style.marginLeft = -1 * ( (hour - 1) * 100 + hour * 1 ) + (ww / 2) - ((minutes*100)/60) + "px";
      }
    }
  }
});
