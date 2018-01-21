require "spec_helper"

RSpec.describe "sign in", type: :feature, js: true do
  let!(:user) { create :user, password: "p@ssw0rd" }

  before do
    visit("/")
  end

  describe "signin without filling the form" do
    it "should validate as required" do
      click_button "SIGN IN"
      expect(page).to have_content("Required")
    end
  end

  describe "sign in with wrong email" do
    it "should validate the email" do
      fill_in "email", with: "wrong-email"
      click_button "SIGN IN"
      expect(page).to have_content("Invalid email address")
    end
  end

  describe "sign in with correct email and but wrong password" do
    it "should not sign in" do
      fill_in "email", with: user.email
      fill_in "password", with: "p@ssw0rd-wrong"
      click_button "SIGN IN"
      expect(page).to have_content("Failed to sign in: Wrong email or password.")
    end
  end

  describe "sign in with correct email and password" do
    it "should sign in succesully" do
      fill_in "email", with: user.email
      fill_in "password", with: "p@ssw0rd"
      click_button "SIGN IN"
      expect(page).to have_content("Signed in successfully.")
    end
  end
end
