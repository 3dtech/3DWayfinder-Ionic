angular.module('app.services', ['wf.api'])
.filter('wfThumbnail', ['apiService', function(apiService) {
  return function(id) {
    if (id) {
      return apiService.images.thumbnail.url(id);
    } else {
      return "";
    }
  };
}]);