class Zombie < ActiveRecord::Base
  scope :rotting, where(rotting: true)
  scope :fresh, where("age < 20")
  scope :recent, order("created_at DESC").limit(3)
end


# Method chaining to create queries

# Zombie.rotting.limit(5)
# Zombie.recent.rotting
# Zombie.recent.fresh.rotting