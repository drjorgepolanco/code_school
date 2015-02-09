class AddAgeToZombies < ActiveRecord::Migration
  def change
    add_column :zombies, :age, :integer
  end
end
