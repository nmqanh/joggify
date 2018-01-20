RSpec.describe Api::V1::ReportsController, type: :controller do
  let!(:admin_user)   { create :admin_user }
  let!(:manager_user) { create :manager_user }
  let!(:normal_user)  { create :user }
  let!(:other_user)   { create :user }

  let!(:time_entries)       { [1, 2, 3].map { |_| create(:time_entry, user: normal_user, date: Faker::Date.between(60.days.ago, 10.days.ago)) } }
  let!(:time_entries_other) { [1, 2, 3].map { |_| create(:time_entry, user: other_user, date: Faker::Date.between(60.days.ago, 10.days.ago)) } }

  describe "time_entries_by_weeks" do
    let(:report_params) {
      {
        from_date: 60.days.ago.to_date.to_s,
        to_date: 10.days.ago.to_date.to_s
      }
    }
    subject { get :time_entries_by_weeks, params: report_params }
    describe "not signed-in user" do
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end

    describe "normal user " do
      before { token_sign_in normal_user }
      let(:expected) {
        TimeEntryReport.by_weeks(
          user: normal_user,
          from_date: report_params[:from_date],
          to_date: report_params[:to_date]
        ).as_json
      }
      it "should render report normally for current user" do
        subject
        expect(response.body).to eql CaseTransform.camel_lower(expected).to_json
      end

      describe "normal user tries to request report from another user" do
        let!(:report_params) {
          {
            from_date: 60.days.ago.to_date.to_s,
            to_date: 10.days.ago.to_date.to_s,
            user_id: other_user.id
          }
        }
        it "should render report normally for current user and ignore user_id params" do
          subject
          expect(response.body).to eql CaseTransform.camel_lower(expected).to_json
        end
      end
    end
    describe "manager user " do
      before { token_sign_in manager_user }

      describe "manager user tries to request report from another user" do
        let!(:report_params) {
          {
            from_date: 60.days.ago.to_date.to_s,
            to_date: 10.days.ago.to_date.to_s,
            user_id: other_user.id
          }
        }
        let(:expected) {
          TimeEntryReport.by_weeks(
            user: manager_user,
            from_date: report_params[:from_date],
            to_date: report_params[:to_date]
          ).as_json
        }
        it "should render report normally for current user and ignore user_id params" do
          subject
          expect(response.body).to eql CaseTransform.camel_lower(expected).to_json
        end
      end
    end
    describe "admin user " do
      before { token_sign_in admin_user }

      describe "admin user tries to request report from another user" do
        let!(:report_params) {
          {
            from_date: 60.days.ago.to_date.to_s,
            to_date: 10.days.ago.to_date.to_s,
            user_id: other_user.id
          }
        }
        let(:expected) {
          TimeEntryReport.by_weeks(
            user: other_user,
            from_date: report_params[:from_date],
            to_date: report_params[:to_date]
          ).as_json
        }
        it "should render report normally for current user and ignore user_id params" do
          subject
          expect(response.body).to eql CaseTransform.camel_lower(expected).to_json
        end
      end
    end
  end
end
