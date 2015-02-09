class Role < ActiveRecord::Base
  has_many :assignments
  has_many :zombies, through: :assignments
end
