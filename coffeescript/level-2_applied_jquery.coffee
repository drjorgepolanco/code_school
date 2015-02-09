# =================
# 2. Applied jQuery
# =================


# ------------------------------------------------------------------------------
# Js to Coffee I
# --------------

# Convert the commented jQuery code below to CoffeeScript

# jQuery(function($) {
#   $('#newCoffee a').click(function() {
#     alert('New coffee added');
#   });
# });

$ ->
  $('#newCoffee a').click ->
    alert "New coffee added"


# ------------------------------------------------------------------------------
# Js to Coffee II
# ---------------

# Convert the commented jQuery code below to CoffeeScript and use CoffeeScript-style 
# string interpolation.

# $('#newCoffee a').click(function() {
#   var name = prompt('Name of coffee:');
#   alert("New coffee added: " + name);
# });

$('#newCoffee a').click ->
  name = prompt "Name of coffee:"
  alert "New coffee added: #{name}"


# ------------------------------------------------------------------------------
# Js to Coffee III
# ----------------

# Convert the commented jQuery to CoffeeScript and use CoffeeScript-style string 
# interpolation.

# $('#newCoffee a').click(function() {
#   var coffee, name;
#   name = prompt('Name of coffee:');
#   coffee = $("<li>" + name + "</li>");
#   $('ul.drink').append(coffee);
# });

$('#newCoffee a').click ->
  name = prompt "Name of coffee:"
  coffee = $("<li>#{name}</li>")
  $('ul.drink').append(coffee)


# ------------------------------------------------------------------------------
# Js to Coffee IV
# ---------------

# Convert the commented jQuery code below to CoffeeScript. Use @ instead of this.

# $('.drink li a').click(function(e) {
#   e.preventDefault();
#   alert($(this).text());
# });

$('.drink li a').click (e) ->
  e.preventDefault()
  alert $(@).text()


# ------------------------------------------------------------------------------
# Js to Coffee V
# --------------

# Convert the commented jQuery code below to CoffeeScript

# $('.drink li').mouseenter(function() {
#   $(this).find('span').show();
# });
# $('.drink li').mouseleave(function() {
#   $(this).find('span').hide();
# });

$('.drink li').mouseenter ->
  $(@).find('span').show()
$('.drink li').mouseleave ->
  $(@).find('span').hide()


# ------------------------------------------------------------------------------
# Js to Coffee VI
# ---------------

# Convert the commented jQuery code below to CoffeeScript

# $('.drink li').hover(function() {
#   $(this).find('span').show();
# }, function() {
#   $(this).find('span').hide();
# });

$('.drink li').hover( 
  ->
    $(@).find('span').show()
  ->
    $(@).find('span').hide()
)

