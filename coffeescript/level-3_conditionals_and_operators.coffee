# ===========================
# 3. Conditionals & Operators
# ===========================


# ------------------------------------------------------------------------------
# Conditionals
# ------------

# Make sure the alert function is called only if caffeineLevel > 5.

# alert "High Caffeine Level"

alert "High Caffeine Level" if caffeineLevel > 5


# ------------------------------------------------------------------------------
# Conditionals II
# ---------------

# CoffeeScript does not support ternary operators. Change the code below to use 
# if/then/else.

# caffeineLevel > 5 ? alert('Too High') : alert('OK');

if caffeineLevel > 5 then alert('Too High') else alert('OK')


# ------------------------------------------------------------------------------
# Conditionals III
# ----------------

# Rewrite the javascript below to use an unless conditional.

# if(!coffeeReady){
#   alert('Please wait 5 more minutes.')
# }

alert('Please wait 5 more minutes.') unless coffeeReady


# ------------------------------------------------------------------------------
# Chained Comparisons
# -------------------

# if lowLevel < newLevel && newLevel < highLevel
#   alert 'ok'
# else
#   alert 'abnormal caffeine level'

if lowLevel < newLevel < highLevel 
  alert 'ok'
else 
  alert 'abnormal caffeine level'


# ------------------------------------------------------------------------------
# Switch / Case
# -------------

# Given the JavaScript code below, rewrite it in CoffeeScript using a switch/when 
# expression.

# if (newLevel === 1) {
#   message = 'Out of bed yet?';
# } else if (newLevel === 2) {
#   message = 'Good morning!';
# } else {
#   message = 'You should stop while you can';
# }

message = switch newLevel
  when 1 then 'Out of bed yet?'
  when 2 then 'Good morning!'
  else 'You should stop while you can'


# ------------------------------------------------------------------------------
# Existential Operator
# --------------------

# Make use of CoffeeScript's existential operator (the ?) to rewrite the JavaScript 
# code below using CoffeeScript.

# if (typeof newLevel !== "undefined" && newLevel !== null){
#   checkLevel(newLevel);
# } else {
#   resetLevel();
# }

if newLevel?
  checkLevel(newLevel)
else
  resetLevel()


# ------------------------------------------------------------------------------
# Existential Operator II
# -----------------------

# Use the existential operator (the ?) to make sure the checkLevel and resetLevel 
# functions are defined before calling them.

# if level?
#   checkLevel(level)
# else
#   resetLevel()

if level?
  checkLevel?(level)
else
  resetLevel?(

