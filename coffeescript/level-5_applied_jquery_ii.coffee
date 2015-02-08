# ====================
# 5. Applied jQuery II
# ====================


# ------------------------------------------------------------------------------
# jQuery & Object Notation
# ------------------------

# Convert the existing JavaScript code to CoffeeScript.

# jQuery(function($){
#   $('.drink a').click(function(){
#     var newStyle = {
#       'color': '#F00',
#       'font-weight': 'bold'
#     };
#     $(this).css(newStyle)
#   });
# });

$ ($) ->
  $('.drink a').click ->
    newStyle =
      'color': '#F00'
      'font-weight': 'bold'
    $(@).css(newStyle)


# ------------------------------------------------------------------------------
# jQuery & Object Notation - Part II
# ----------------------------------

# Wrap the following code into an init function that belongs to a new object 
# named coffeeList. After defining coffeeList, invoke the coffeeList.init function.

# $('.drink a').click (e) ->
#   e.preventDefault()
#   alert $(@).text()

coffeeList =
  init: ->
    $('.drink a').click (e) ->
      e.preventDefault()
      alert $(@).text()

coffeeList.init()


# ------------------------------------------------------------------------------
# jQuery & Object Notation - Part III
# -----------------------------------

# Convert the existing JavaScript code to CoffeeScript. Make sure you replace 
# the for loop with a list comprehension.

# $.ajax({
#   url: '/coffeeList',
#   method: 'GET',
#   success: function(results) {
#     var i = null
#       , coffee = null;
#     for (i = 0; i < results.length; i++) {
#       coffee = results[i];
#       if (coffee.level > 3) {
#         $('ul.drink').append("<li>" + coffee.name + "</li>")
#       }
#     }
#   },
#   error: function(results) {
#     alert("failure " + results);
#   }
# });

$.ajax
  url: '/coffeeList'
  method: 'GET'
  success: (results) ->
    $('ul.drink').append("<li>#{coffee.name}</li>") for coffee in results when coffee.level > 3
  error: (results) ->
    alert "failure #{results}"
