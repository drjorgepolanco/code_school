class CreateAssignments < ActiveRecord::Migration
  def change
    create_table :assignments do |t|
      t.integer :zombie_id
      t.integer :role_id

      t.timestamps null: false
    end
    add_index :assignments, :zombie_id
    add_index :assignments, :role_id
  end
end
