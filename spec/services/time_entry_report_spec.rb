require "rails_helper"

RSpec.describe TimeEntryReport do
  let!(:user) { create :user }
  let!(:time_entries) { [1, 2, 3, 4, 5].map { |_| create(:time_entry, user: user, date: Faker::Date.between(60.days.ago, 10.days.ago)) } }

  it "expects to group result by weeks correctly" do
    distances_hash = {}
    duration_hash = {}
    time_entries.each do |time_entry|
      key = time_entry.date.beginning_of_week.to_date.to_s
      distances_hash[key] = (distances_hash[key] || 0) + time_entry.distance_in_kilometres
      duration_hash[key] = (duration_hash[key] || 0) + time_entry.duration_in_minutes
    end

    min_date = nil

    expected = distances_hash.map do |date, distance_in_kilometres|
      week_date = Date.parse(date)
      {
        week: "Week #{week_date.cweek} - #{week_date.strftime("%d/%m/%Y")}",
        distanceInKilometres: distance_in_kilometres,
        averageSpeedInKmph: duration_hash[date] == 0 ? 0 : (distance_in_kilometres * 60) / duration_hash[date]
      }
    end

    result = described_class.by_weeks(
      from_date: 60.days.ago.to_date.to_s,
      to_date: 10.days.ago.to_date.to_s,
      user: user
    )

    expected.each do |expected_item|
      expect(result).to include(expected_item)
    end
  end
end
