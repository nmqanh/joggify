class CreateTimeEntries < ActiveRecord::Migration[5.1]
  def change
    create_table :time_entries do |t|
      t.references :user, null: false, index: true, foreign_key: true
      t.integer    :duration_in_minutes, null: false
      t.float      :distance_in_kilometres, null: false
      t.datetime   :date, null: false, index: true
      t.timestamps
    end
  end
end
