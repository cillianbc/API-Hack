var API_KEY = 'AIzaSyDfytDoXF01OD9LrVti-BukQjNjxlj2u_I';
var API_URL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
var getURL =function(){
  $('.website').submit( function(event){
    // zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var URL_TO_GET_RESULTS_FOR = $(this).find("input[name='website']").val();
        runPagespeed(URL_TO_GET_RESULTS_FOR);
	});
  };

// Object that will hold the callbacks that process results from the
// PageSpeed Insights API.
var callbacks = {}

// Invokes the PageSpeed Insights API. The response will contain
// JavaScript that invokes our callback with the PageSpeed results.
function runPagespeed(URL_TO_GET_RESULTS_FOR) {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  var query = [
    'url=' + URL_TO_GET_RESULTS_FOR,
    'callback=runPagespeedCallbacks',
    'key=' + API_KEY,
  ].join('&');
  s.src = API_URL + query;
  document.head.insertBefore(s, null);
}

// Our JSONP callback. Checks for errors, then invokes our callback handlers.
function runPagespeedCallbacks(result) {
  if (result.error) {
    var errors = result.error.errors;
    for (var i = 0, len = errors.length; i < len; ++i) {
      if (errors[i].reason == 'badRequest' && API_KEY == 'yourAPIKey') {
        alert('Please specify your Google API key in the API_KEY variable.');
      } else {
        // NOTE: your real production app should use a better
        // mechanism than alert() to communicate the error to the user.
        alert(errors[i].message);
      }
    }
    return;
  }

  // Dispatch to each function on the callbacks object.
  for (var fn in callbacks) {
    var f = callbacks[fn];
    if (typeof f == 'function') {
      callbacks[fn](result);
    }
  }
}

callbacks.displayTopPageSpeedSuggestions = function(result) {
  var results = [];
  var score = result.ruleGroups.SPEED.score;
  $('.huge').text(score);
  var ruleResults = result.formattedResults.ruleResults;
  for (var i in ruleResults) {
    var ruleResult = ruleResults[i];
    var summary = ruleResults[i].summary;
      if (ruleResult.ruleImpact < 1.0) continue;
      results.push({name: ruleResult.localizedRuleName});
  };
  for (each in results){
    $('.results').append('<h3>'+results[each].name+'</h3>');
    if (results[each].name === "Leverage browser caching")
      $('.results').append('<p><a href="https://developers.google.com/speed/docs/insights/LeverageBrowserCaching">Learn How</a><p>');
    else if(results[each].name === "Reduce server response time")
      $('.results').append('<p><a href="https://developers.google.com/speed/docs/insights/Server">Learn How</a><p>');
    else if(results[each].name === "Minify JavaScript" || results[each].name === "Minify CSS")
      $('.results').append('<p><a href="https://developers.google.com/speed/docs/insights/MinifyResources">Learn How</a><p>');
    else if(results[each].name === "Eliminate render-blocking JavaScript and CSS in above-the-fold content")
      $('.results').append('<p><a href="https://developers.google.com/speed/docs/insights/BlockingJS">Learn How</a><p>');
    if (results[each].name === "Optimize images")
      $('.results').append('<p><a href="https://developers.google.com/speed/docs/insights/OptimizeImages">Learn How</a><p>');
  }
  $('.panel-footer').css("display","block");
};

// Invoke the callback that fetches results. Async here so we're sure
// to discover any callbacks registered below, but this can be
// synchronous in your code.
var slide = function(){$('.details').click(function(){
    $('.results').slideToggle("slow");
})};


