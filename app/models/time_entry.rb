class TimeEntry < ActiveRecord::Base
  belongs_to :user
  validates_presence_of :user, :duration_in_minutes, :distance_in_kilometres
  validates_numericality_of :duration_in_minutes, :distance_in_kilometres, greater_than: 0
  validates_numericality_of :duration_in_minutes, only_integer: true
  validates :date, date: true

  self.per_page = 20
end
