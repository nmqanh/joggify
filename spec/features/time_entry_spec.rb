require "spec_helper"

RSpec.describe "User does CRUD time_entry", type: :feature, js: true do
  let!(:user) { create :user }

  before { ui_sign_in(user) }

  describe("create new time entry") do
    before do
      click_button "+ ADD JOGGING TRIP"
    end

    it "should show adding new jogging trip form" do
      expect(page).to have_content("Add new jogging trip")
    end

    describe "adding without adding value to jogging form" do
      it "should validate as required" do
        within("form:nth-child(2)") do
          click_button "ADD"
          expect(self).to have_content "Required"
        end
      end
    end

    describe "adding negative number to distance" do
      it "should validate to require positive number" do
        within("form:nth-child(2)") do
          fill_in "distanceInKilometres", with: Faker::Number.negative
          click_button "ADD"
          expect(self).to have_content "Distance must be greater than 0"
        end
      end
    end

    describe "adding negative number to duration" do
      it "should validate to require positive number" do
        within("form:nth-child(2)") do
          fill_in "durationInMinutes", with: Faker::Number.between(-50, 0)
          click_button "ADD"
          expect(self).to have_content "Duration must be greater than 0"
        end
      end
    end

    describe "adding new time entry with correct information" do
      let(:new_time_entry) {
        {
          date: Faker::Date.between(30.days.ago, Date.today).to_date.to_s,
          distance_in_kilometres: Faker::Number.between(1, 30),
          duration_in_minutes: Faker::Number.between(100, 500)
        }
      }
      it "should create succesully with add to the current list" do
        within("form:nth-child(2)") do
          fill_in "date", with: new_time_entry[:date]
          fill_in "distanceInKilometres", with: new_time_entry[:distance_in_kilometres]
          fill_in "durationInMinutes", with: new_time_entry[:duration_in_minutes]
          click_button "ADD"
        end

        expect(page).to have_content "New time entry successfully added!"
        expect(page).to have_content "Jog #{"%.2f" % new_time_entry[:distance_in_kilometres]} km in #{new_time_entry[:duration_in_minutes]} minutes with average speed #{"%.2f" % ((new_time_entry[:distance_in_kilometres] * 60.0) / new_time_entry[:duration_in_minutes])} km/h"
      end
    end
  end

  describe("delete existing time entry") do
    let!(:time_entry)      { create :time_entry, user: user }
    let!(:time_entry_text) { "Jog #{"%.2f" % time_entry.distance_in_kilometres} km in #{time_entry.duration_in_minutes} minutes with average speed #{"%.2f" % ((time_entry.distance_in_kilometres * 60.0) / time_entry.duration_in_minutes)} km/h " }
    it "expect to show existing time entry on the list" do
      expect(page).to have_content :time_entry_text
    end
    it "should be able do delete an existing time entry" do
      click_button "Remove"
      expect(page).to have_content "Do you want to remove this jogging time?"
      click_button "Agree"
      expect(page).to have_no_content time_entry_text
      expect(TimeEntry.find_by(id: time_entry.id)).to be_nil
    end
  end

  describe("edit existing time entry") do
    let!(:time_entry)      { create :time_entry, user: user }
    let!(:time_entry_text) { "Jog #{"%.2f" % time_entry.distance_in_kilometres} km in #{time_entry.duration_in_minutes} minutes with average speed #{"%.2f" % ((time_entry.distance_in_kilometres * 60.0) / time_entry.duration_in_minutes)} km/h " }
    it "expect to show existing time entry on the list" do
      expect(page).to have_content :time_entry_text
    end

    let!(:next_time_entry) {
        {
          date: Faker::Date.between(30.days.ago, Date.today).to_date.to_s,
          distance_in_kilometres: Faker::Number.between(1, 30),
          duration_in_minutes: Faker::Number.between(100, 500)
        }
      }

    it "should be able do edit an existing time entry" do
      click_button "Edit"

      within("form:nth-child(3)") do
        find("input[name=date]").send_keys [:control, "a"], :backspace
        find("input[name=date]").set(next_time_entry[:date])
        find("input[name=distanceInKilometres]").send_keys [:control, "a"], :backspace
        find("input[name=distanceInKilometres]").set(next_time_entry[:distance_in_kilometres])
        find("input[name=durationInMinutes]").send_keys [:control, "a"], :backspace
        find("input[name=durationInMinutes]").set(next_time_entry[:duration_in_minutes])
        click_button "SAVE"
      end

      expect(page).to have_content "Edit successfully!"
      expect(page).to have_content "Jog #{"%.2f" % next_time_entry[:distance_in_kilometres]} km in #{next_time_entry[:duration_in_minutes]} minutes with average speed #{"%.2f" % ((next_time_entry[:distance_in_kilometres] * 60.0) / next_time_entry[:duration_in_minutes])} km/h"
    end
  end
end
