require "rails_helper"

RSpec.describe Api::V1::TimeEntriesController, type: :controller do
  let!(:admin_user)   { create :admin_user }
  let!(:manager_user) { create :manager_user }
  let!(:normal_user)  { create :user }
  let!(:other_user)   { create :user }

  describe "action create" do
    let(:time_entry_params) {
      {
        distance_in_kilometres: Faker::Number.between(1, 30),
        duration_in_minutes: Faker::Number.between(100, 500),
        date: Faker::Date.between(30.days.ago, Date.today).to_s,
      }
    }

    subject {
      post(
        :create,
        params: time_entry_params
      )
    }

    describe "not signed-in user" do
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end

    describe "normal user" do
      before { token_sign_in normal_user }
      it "should allow normal_user to create new time entry" do
        expect { subject }.to change { TimeEntry.count }.by(1)
        new_time_entry = TimeEntry.first
        expect(new_time_entry.distance_in_kilometres).to eql time_entry_params[:distance_in_kilometres] * 1.0
        expect(new_time_entry.duration_in_minutes).to eql time_entry_params[:duration_in_minutes]
        expect(new_time_entry.date.to_date.to_s).to eql time_entry_params[:date]
        expect(new_time_entry.user_id).to eql normal_user.id
      end

      describe "create new time entry for another user" do
        let!(:time_entry_params) {
          {
            distance_in_kilometres: Faker::Number.between(1, 30),
            duration_in_minutes: Faker::Number.between(100, 500),
            date: Faker::Date.between(30.days.ago, Date.today).to_s,
            user_id: other_user.id
          }
        }

        it "should create new time entry for current user and ignore params user_id" do
          expect { subject }.to change { TimeEntry.count }.by(1)
          new_time_entry = TimeEntry.first
          expect(new_time_entry.user_id).to eql normal_user.id
        end
      end
    end

    describe "manager" do
      before { token_sign_in manager_user }
      describe "create new time entry for another user" do
        let!(:time_entry_params) {
          {
            distance_in_kilometres: Faker::Number.between(1, 30),
            duration_in_minutes: Faker::Number.between(100, 500),
            date: Faker::Date.between(30.days.ago, Date.today).to_s,
            user_id: other_user.id
          }
        }

        it "should create new time entry for current user and ignore params user_id" do
          expect { subject }.to change { TimeEntry.count }.by(1)
          new_time_entry = TimeEntry.first
          expect(new_time_entry.user_id).to eql manager_user.id
        end
      end
    end

    describe "admin" do
      before { token_sign_in admin_user }
      describe "create new time entry for another user" do
        let!(:time_entry_params) {
          {
            distance_in_kilometres: Faker::Number.between(1, 30),
            duration_in_minutes: Faker::Number.between(100, 500),
            date: Faker::Date.between(30.days.ago, Date.today).to_s,
            user_id: other_user.id
          }
        }

        it "should create new time entry for current user and ignore params user_id" do
          expect { subject }.to change { TimeEntry.count }.by(1)
          new_time_entry = TimeEntry.last
          expect(new_time_entry.user_id).to eql other_user.id
        end
      end
    end
  end
  describe "action index" do
    let!(:time_entries)       { [1, 2, 3].map { |_| create(:time_entry, user: normal_user, date: Faker::Date.between(60.days.ago, 10.days.ago)) } }
    let!(:time_entries_other) { [1, 2, 3].map { |_| create(:time_entry, user: other_user, date: Faker::Date.between(60.days.ago, 10.days.ago)) } }

    let(:get_params) {
      {
        from_date: 60.days.ago.to_date.to_s,
        to_date: 10.days.ago.to_date.to_s,
        is_date_ascending: true
      }
    }
    subject { get :index, params: get_params }

    describe "not signed-in user" do
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end

    describe "normal user" do
      before { token_sign_in normal_user }

      it "should return all entries of current user" do
        subject
        expected_result = ActiveModel::Serializer::CollectionSerializer.new(
          time_entries.sort_by(&:date), each_serializer: TimeEntrySerializer
        ).as_json

        expect(response.body).to eql CaseTransform.camel_lower(expected_result).to_json
      end

      describe "normal user tries to get time entries of other user" do
        let!(:get_params) {
          {
            from_date: 60.days.ago.to_date.to_s,
            to_date: 10.days.ago.to_date.to_s,
            is_date_ascending: true,
            user_id: other_user.id
          }
        }

        it "should return all entries of current user and ignore user_id" do
          subject
          expected_result = ActiveModel::Serializer::CollectionSerializer.new(
            time_entries.sort_by(&:date), each_serializer: TimeEntrySerializer
          ).as_json

          expect(response.body).to eql CaseTransform.camel_lower(expected_result).to_json
        end
      end
    end

    describe "manager user" do
      before { token_sign_in manager_user }
      describe "manager user tries to get time entries of other user" do
        let!(:get_params) {
          {
            from_date: 60.days.ago.to_date.to_s,
            to_date: 10.days.ago.to_date.to_s,
            is_date_ascending: true,
            user_id: other_user.id
          }
        }

        it "should return all entries of current user and ignore user_id" do
          subject
          expect(response.body).to eql "[]"
        end
      end
    end

    describe "admin user" do
      before { token_sign_in admin_user }
      describe "manager user tries to get time entries of other user" do
        let!(:get_params) {
          {
            from_date: 60.days.ago.to_date.to_s,
            to_date: 10.days.ago.to_date.to_s,
            is_date_ascending: true,
            user_id: other_user.id
          }
        }

        it "should return all entries of the other users" do
          subject
          expected_result = ActiveModel::Serializer::CollectionSerializer.new(
            time_entries_other.sort_by(&:date), each_serializer: TimeEntrySerializer
          ).as_json

          expect(response.body).to eql CaseTransform.camel_lower(expected_result).to_json
        end
      end
    end
  end

  describe "action update" do
    let!(:time_entry)       { create :time_entry, user: normal_user }
    let!(:time_entry_other) { create :time_entry, user: other_user }
    let(:time_entry_params) {
      {
        id: time_entry.id,
        distance_in_kilometres: Faker::Number.between(1, 30),
        duration_in_minutes: Faker::Number.between(100, 500),
        date: Faker::Date.between(30.days.ago, Date.today).to_s
      }
    }

    subject {
      patch(
        :update,
        params: time_entry_params
      )
    }

    describe "not signed-in user" do
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end

    describe "normal user" do
      before { token_sign_in normal_user }
      it "should allow normal_user to edit existing time entry" do
        subject
        result = time_entry.reload
        expect(result.distance_in_kilometres).to eql time_entry_params[:distance_in_kilometres] * 1.0
        expect(result.duration_in_minutes).to eql time_entry_params[:duration_in_minutes]
        expect(result.date.to_date.to_s).to eql time_entry_params[:date]
        expect(result.user_id).to eql normal_user.id
      end

      describe "edit time entry of another user" do
        let!(:time_entry_params) {
          {
            id: time_entry_other.id,
            distance_in_kilometres: Faker::Number.between(1, 30),
            duration_in_minutes: Faker::Number.between(100, 500),
            date: Faker::Date.between(30.days.ago, Date.today).to_s
          }
        }

        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end
    end

    describe "manager" do
      before { token_sign_in manager_user }
      describe "edit time entry of another user" do
        let!(:time_entry_params) {
          {
            id: time_entry_other.id,
            distance_in_kilometres: Faker::Number.between(1, 30),
            duration_in_minutes: Faker::Number.between(100, 500),
            date: Faker::Date.between(30.days.ago, Date.today).to_s
          }
        }

        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end
    end

    describe "admin" do
      before { token_sign_in admin_user }
      describe "edit time entry of another user" do
        let!(:time_entry_params) {
          {
            id: time_entry_other.id,
            distance_in_kilometres: Faker::Number.between(1, 30),
            duration_in_minutes: Faker::Number.between(100, 500),
            date: Faker::Date.between(30.days.ago, Date.today).to_s
          }
        }

        it "should allow admin to edit the time entry of another user" do
          subject
          result = time_entry_other.reload
          expect(result.distance_in_kilometres).to eql time_entry_params[:distance_in_kilometres] * 1.0
          expect(result.duration_in_minutes).to eql time_entry_params[:duration_in_minutes]
          expect(result.date.to_date.to_s).to eql time_entry_params[:date]
          expect(result.user_id).to eql other_user.id
        end
      end
    end
  end

  describe "action destroy" do
    let!(:time_entry)       { create :time_entry, user: normal_user }
    let!(:time_entry_other) { create :time_entry, user: other_user }
    let(:delete_params) {
      {
        id: time_entry.id
      }
    }

    subject {
      delete(
        :destroy,
        params: delete_params
      )
    }

    describe "not signed-in user" do
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end

    describe "normal user" do
      before { token_sign_in normal_user }
      it "should allow normal_user to delete existing time entry" do
        subject
        expect(TimeEntry.find_by(id: time_entry.id)).to be_nil
      end

      describe "delete time entry of another user" do
        let!(:delete_params) {
          {
            id: time_entry_other.id
          }
        }

        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end
    end

    describe "manager" do
      before { token_sign_in manager_user }
      describe "delete time entry of another user" do
        let!(:delete_params) {
          {
            id: time_entry_other.id
          }
        }

        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end
    end

    describe "admin" do
      before { token_sign_in admin_user }
      describe "delete entry of another user" do
        let!(:delete_params) {
          {
            id: time_entry_other.id
          }
        }

        it "should allow admin to edit the time entry of another user" do
          subject
          expect(TimeEntry.find_by(id: time_entry_other.id)).to be_nil
        end
      end
    end
  end
end
