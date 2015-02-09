class Assignment < ActiveRecord::Base
  belongs_to :zombie
  belongs_to :role
end
