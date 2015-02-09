# ===============================
# 4. Arrays, Objects & Iterations
# ===============================


# ------------------------------------------------------------------------------
# Coffe on the Range
# ------------------

# Create an array with numbers 1 until 10 using the inclusive (two dot) range syntax.

[1..10]


# ------------------------------------------------------------------------------
# Coffe on the Range II
# ---------------------

# Create an array with numbers 1 through 10 using the exclusive range syntax.

[1...11]


# ------------------------------------------------------------------------------
# Object Literals
# ---------------

# Create a variable named coffee which is an object with a name property set to 
# 'Russian', a level property set to 2 and an isRussian property which holds a 
# function that returns true. Use an object literal.

coffee =
  name: "Russian"
  level: 2
  isRussian: ->
    yes


# ------------------------------------------------------------------------------
# For in Loops
# ------------

# Using the for element in collection loop, iterate over the people collection and 
# print the names of people over 18 years old (person.age > 18). Use the console.log 
# function to print the person.name.

for person in people
  console.log(person.name) if person.age > 18


# ------------------------------------------------------------------------------
# List Comprehension
# ------------------

# Modify the loop below to use a list comprehension.

# for person in people
#   console.log(person.name) if person.age > 18

console.log person.name for person in people when person.age > 18


# ------------------------------------------------------------------------------
# List Comprehension II
# ---------------------

# Refactor the code below to make use of list comprehension.

# for coffee in coffeeList
#   if not coffee.isRussian?()
#     addCoffee(coffee)

addCoffee(coffee) for coffee in coffeeList when coffee.isRussian?() isnt true


# ------------------------------------------------------------------------------
# Splat Arguments
# ---------------

# Change the displayTopPicks function to accept a variable number of suggested 
# coffees by using the splat operator. Use suggested.join(", ") to alert all of 
# the suggested coffees.

# displayTopPicks = (bestCoffee, suggested) ->
#   alert('Top #1 ' + bestCoffee)
#   alert('Suggested: ' + suggested)

displayTopPicks = (bestCoffee, suggested...) ->
  alert('Top #1 ' + bestCoffee)
  alert("Suggested: #{suggested.join(', ')}")

