require "rails_helper"

RSpec.describe UserSerializer do
  let(:user) { create :user }

  let(:expected_attributes) do
    {
      "id": user.id,
      "name": user.name,
      "email": user.email,
      "timezone": user.timezone,
      "role": user.role,
      "label": "#{user.name} - #{user.email}"
    }
  end

  subject { described_class.new(user).as_json }

  it do
    expect(subject).to include expected_attributes
  end
end
