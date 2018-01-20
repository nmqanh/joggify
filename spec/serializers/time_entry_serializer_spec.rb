require "rails_helper"

RSpec.describe TimeEntrySerializer do
  let(:time_entry) { create :time_entry }

  let(:expected_attributes) do
    {
      "id": time_entry.id,
      "date": time_entry.date,
      "distance_in_kilometres": time_entry.distance_in_kilometres,
      "duration_in_minutes": time_entry.duration_in_minutes,
      "updated_at": time_entry.updated_at,
      "created_by_name": "#{time_entry.user.name} - #{time_entry.user.email}"
    }
  end

  subject { described_class.new(time_entry).as_json }

  it do
    expect(subject).to include expected_attributes
  end
end
