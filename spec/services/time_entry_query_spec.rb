require "rails_helper"

RSpec.describe TimeEntryQuery do
  let!(:user1) { create :user }
  let!(:user2) { create :user }
  let!(:user3) { create :user }

  let!(:time_entries_1) { [1, 2, 3].map { |_| create(:time_entry, user: user1) } }
  let!(:time_entries_2) { [1, 2, 3].map { |_| create(:time_entry, user: user2) } }
  let!(:time_entries_3) { [1, 2, 3].map { |_| create(:time_entry, user: user3, date: Faker::Date.between(60.days.ago, 10.days.ago)) } }

  it "should filter the time_entries of correct user 1" do
    expect(described_class.filter(
             user: user1
    )).to match_array(time_entries_1)
  end

  it "should filter the time_entries of correct user 2" do
    expect(described_class.filter(
             user: user2
    )).to match_array(time_entries_2)
  end

  it "should filter the time_entries of correct user 3" do
    expect(described_class.filter(
             user: user3
    )).to match_array(time_entries_3)
  end

  it "should show all time entries when not defining any user" do
    expect(described_class.filter(
             user: nil
    )).to match_array(time_entries_1 + time_entries_2 + time_entries_3)
  end

  it "should not order when not defining is_date_ascending" do
    expect(described_class.filter(
      user: user1
    ).to_a).to eql(
      TimeEntry.where(user: user1).to_a
    )
  end

  it "should return the default order (date descending) when is_date_ascending is false" do
    expect(described_class.filter(
      user: user1,
      is_date_ascending: false
    ).to_a).to eql(
      TimeEntry.where(user: user1).order(
        date: :desc, created_at: :desc
      ).to_a
    )
  end

  it "should return the reversed order (date ascending) when is_date_ascending is true" do
    expect(described_class.filter(
      user: user1,
      is_date_ascending: true
    ).to_a).to eql(
      TimeEntry.where(user: user1).order(
        date: :asc, created_at: :asc
      ).to_a
    )
  end

  it "should return empty array if from date and to date are out of range of available time entries" do
    expect(described_class.filter(
      user: user3,
      from_date: 9.days.ago.to_date.to_s,
      to_date: 8.days.ago.to_date.to_s
    ).to_a).to be_empty
  end

  it "should return all entries if from date and to date are within range of available time entries" do
    expect(described_class.filter(
      user: user3,
      from_date: 60.days.ago.to_date.to_s,
      to_date: 10.days.ago.to_date.to_s
    ).to_a).to match_array(time_entries_3)
  end

  context "part of available time entries fall within the date filter" do
    let!(:time_entry) { create(:time_entry, user: user3, date: 5.days.ago) }

    it "should return part of entries that are within the given date range" do
      expect(described_class.filter(
        user: user3,
        from_date: 6.days.ago.to_date.to_s,
        to_date: 4.days.ago.to_date.to_s
      ).to_a).to match_array([time_entry])
    end
  end
end
