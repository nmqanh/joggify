require "rails_helper"

RSpec.describe User, type: :model do
  describe "Create user with all valid attributes" do
    let(:user) { create :user }

    it "is valid with valid attributes" do
      expect(user).to be_valid
    end
  end

  describe "Create user with invalid attributes" do
    it "is not valid without an email" do
      user = build(:user, email: nil)
      expect(user).to_not be_valid
    end

    it "is not valid without a password" do
      user = build(:user, password: nil)
      expect(user).to_not be_valid
    end

    it "is not valid without a timezone" do
      user = build(:user, timezone: nil)
      expect(user).to_not be_valid
    end

    it "is not valid with a wrong time zone" do
      user = build(:user, timezone: Faker::Name.first_name)
      expect(user).to_not be_valid
    end

    it "is not valid without a name" do
      user = build(:user, name: nil)
      expect(user).to_not be_valid
    end

    it "is not valid without a role" do
      user = build(:user, role: nil)
      expect(user).to_not be_valid
    end

    it "throws error with a wrong role option" do
      expect {
        build(:user, role: Faker::Name.first_name)
      }.to raise_error(ArgumentError)
    end

    context "An existing user already exist" do
      let(:existing_user) { create :user }

      it "has a unique email" do
        user = build(:user, email: existing_user.email)
        expect(user).to_not be_valid
      end
    end
  end
end
