require "rails_helper"

RSpec.describe TimeEntry, type: :model do
  describe "Create time_entry with all valid attributes" do
    let(:time_entry) { create :time_entry }

    it "is valid with valid attributes" do
      expect(time_entry).to be_valid
    end
  end

  describe "Create time_entry with invalid attributes" do
    it "is not valid without a attached user" do
      time_entry = build(:time_entry, user: nil)
      expect(time_entry).to_not be_valid
    end

    it "is not valid without a duration_in_minutes" do
      time_entry = build(:time_entry, duration_in_minutes: nil)
      expect(time_entry).to_not be_valid
    end

    it "is not valid without a distance_in_kilometres" do
      time_entry = build(:time_entry, distance_in_kilometres: nil)
      expect(time_entry).to_not be_valid
    end

    it "is not valid without a date" do
      time_entry = build(:time_entry, date: nil)
      expect(time_entry).to_not be_valid
    end

    it "is not valid with float minutes" do
      time_entry = build(:time_entry, duration_in_minutes: Faker::Number.decimal(2))
      expect(time_entry).to_not be_valid
    end

    it "is not valid with negative minutes" do
      time_entry = build(:time_entry, duration_in_minutes: Faker::Number.negative.to_i)
      expect(time_entry).to_not be_valid
    end

    it "is not valid with negative distance" do
      time_entry = build(:time_entry, distance_in_kilometres: Faker::Number.negative)
      expect(time_entry).to_not be_valid
    end
  end
end
