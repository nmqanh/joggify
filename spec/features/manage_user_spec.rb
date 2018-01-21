require "spec_helper"

RSpec.describe "Test Access to Manage users section", type: :feature, js: true do
  let!(:admin_user)   { create :admin_user }
  let!(:manager_user) { create :manager_user }
  let!(:normal_user)  { create :user }

  describe "normal user tries to access this feature" do
    it "expects not to show manager section" do
      ui_sign_in(normal_user)
      expect(page).to have_content("Jogging Trips")
      expect(page).to have_no_content("Manage Users")
    end

    it "expects to show page not found" do
      ui_sign_in(normal_user, route: "/users")
      expect(page).to have_content("This page can not be found")
    end
  end

  describe "manager user tries to access this feature" do
    it "expects to show manager section" do
      ui_sign_in(manager_user)
      expect(page).to have_content("Jogging Trips")
      expect(page).to have_content("Manage Users")
    end

    it "expects to show users in Manager users" do
      ui_sign_in(manager_user, route: "/users")
      expect(page).to have_content(admin_user.email)
      expect(page).to have_content(manager_user.email)
      expect(page).to have_content(normal_user.email)
    end
  end

  describe "admin user tries to access this feature" do
    it "expects to show admin section" do
      ui_sign_in(admin_user)
      expect(page).to have_content("Jogging Trips")
      expect(page).to have_content("Manage Users")
    end

    it "expects to show users in admin users" do
      ui_sign_in(admin_user, route: "/users")
      expect(page).to have_content(admin_user.email)
      expect(page).to have_content(manager_user.email)
      expect(page).to have_content(normal_user.email)
    end
  end
end
