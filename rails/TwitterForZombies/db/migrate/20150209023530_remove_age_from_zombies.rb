class RemoveAgeFromZombies < ActiveRecord::Migration
  def change
    remove_column :zombies, :age, :integer
  end
end
