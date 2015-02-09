# ========================
# 1. Variables & Functions
# ========================


# ------------------------------------------------------------------------------
# Variable Assignment
# -------------------

# Assign your name as a string value to a variable named person.

person = "Jorge"


# ------------------------------------------------------------------------------
# Functions
# ---------

# Define a function named greet that takes no argument and alerts 'Hello CoffeeScript'

greet = ->
  alert "Hello CoffeeScript"


# ------------------------------------------------------------------------------
# Functions II
# ------------

# Given the greet function below, change it so that it accepts a single argument 
# and prints out the value inside the alert.

# greet = ->
#   alert "Hello CoffeeScript"

greet = (value) ->
  alert "Hello " + value


# ------------------------------------------------------------------------------
# Functions III
# -------------

# Given the code below, change the greet function so that it accepts two arguments 
# instead of just one. It should alert both arguments, separated by a single white 
# space.

# greet = (message) ->
#  alert message

greet = (message, other_message) ->
  alert message + " " + other_message


# ------------------------------------------------------------------------------
# Functions IV
# ------------

# Change the greet function so that it uses a default value of 'Stranger' for the 
# name parameter.

# greet = (name) -> alert name

greet = (name="Stranger") -> 
  alert name


# ------------------------------------------------------------------------------
# Functions V
# -----------

# Change the greet function so that it uses CoffeeScript-style string interpolation.

# greet = (name='Stranger') ->
#   "Hello, " + name

greet = (name='Stranger') ->
  "Hello, #{name}"


# ------------------------------------------------------------------------------
# Sum Function
# ------------

# Create a function named sum that takes two numbers as arguments and returns 
# the sum of those numbers

sum = (x, y) ->
  x + y

  