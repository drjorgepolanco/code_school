class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.references :zombie, index: true
      t.string :message

      t.timestamps null: false
    end
    add_foreign_key :tweets, :zombies
  end
end
