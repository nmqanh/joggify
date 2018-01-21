require "spec_helper"

RSpec.describe "sign up", type: :feature, js: true do
  before do
    visit("/signup")
  end

  describe "sign up without filling the form" do
    it "should validate as required" do
      click_button "SIGN UP"
      expect(page).to have_content("Required")
    end
  end

  describe "sign up with wrong email" do
    it "should validate the email" do
      fill_in "email", with: "wrong-email"
      click_button "SIGN UP"
      expect(page).to have_content("Invalid email address")
    end
  end

  describe "sign up with password too short" do
    it "should validate the short password" do
      fill_in "password", with: "short"
      click_button "SIGN UP"
      expect(page).to have_content("Password must have at least 8 characters")
    end
  end

  describe "sign up but confirm password is different than the main password" do
    it "should validate to require two same passwords" do
      fill_in "password", with: "p@ssw0rd"
      fill_in "confirmPassword", with: "p@ssw0rd-different"
      click_button "SIGN UP"
      expect(page).to have_content("Confirm password must equal to password")
    end
  end

  context "sign up but the email was already registered" do
    let(:existing_user) { create :user }
    it "should not allow to sign up" do
      fill_in "name", with: Faker::Name.name
      fill_in "email", with: existing_user.email
      fill_in "password", with: "p@ssw0rd"
      fill_in "confirmPassword", with: "p@ssw0rd"

      click_button "SIGN UP"
      expect(page).to have_content("Email has already been taken")
    end
  end
end
