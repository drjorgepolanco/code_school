# =====================
# 6. Object Orientation
# =====================


# ------------------------------------------------------------------------------
# Classes - Part I
# ----------------

# Create a Coffee class that will produce coffee objects. In that class, create 
# a constructor that takes name and level as arguments and sets them as instance 
# variables. Also, make sure you create a function called isRussian.

# coffee =
#   name: 'Russian'
#   level: 2
#   isRussian: -> @name is 'Russian'

class Coffee
  constructor: (name, level) ->
    @name = name
    @level = level
  isRussian: -> @name is 'Russian'


# ------------------------------------------------------------------------------
# Classes - Part II
# -----------------

# For an already existing Coffee class, create a new coffee object passing in 
# your name (string) and any number (as the level), then assign it to a 
# variable named coffee.

coffee = new Coffee("Jorge", 7)


# ------------------------------------------------------------------------------
# Property Arguments
# ------------------

# Refactor the constructor to use property arguments. Also, set @level to be an 
# optional argument by setting its default value to 0.

# class Coffee
#   constructor: (name, level) ->
#     @name = name
#     @level = level or 0

#   isRussian: -> @name is 'Russian'

class Coffee
  constructor: (@name, @level=0) ->
  isRussian: -> @name is 'Russian'


# ------------------------------------------------------------------------------
# Class Inheritance
# -----------------

# Make the Coffee class inherit from Drink and override the serve method to 
# return false if @sleeve is false, otherwise invoke the superclass method. 
# (Note: The Drink class is defined below)

# class Coffee
#   constructor: (@name, @level=0) ->

class Coffee extends Drink
  constructor: (@name, @level=0) ->
  serve: ->
    if @sleeve is false
      false
    else
      "#{super(@sleeve)}"


# ------------------------------------------------------------------------------
# Classes with jQuery
# -------------------

# On the DrinkLink class below, implement the watchClick method so that when any 
# link is clicked, its color is changed to #F00.

class DrinkLink
  watchClick: ->
    $('a').click ->
      newStyle =
        "color": "#F00"
      $(@).css(newStyle)


# ------------------------------------------------------------------------------
# Watch those @'s
# ---------------

# Fix the bug on the code below, which is causing the @linkClicked variable to 
# not be properly set when a link is clicked.

# class DrinkLink
#   constructor: (@linkClicked=false) ->
#   watchClick: ->
#     $('.drink a').click (event) ->
#       $(event.target).css('color', '#F00')
#       @linkClicked = true

class DrinkLink
  constructor: (@linkClicked=false) ->
  watchClick: ->
    $('.drink a').click (event) =>
      $(event.target).css('color', '#F00')
      @linkClicked = true

























