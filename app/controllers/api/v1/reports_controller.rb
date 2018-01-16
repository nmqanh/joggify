class Api::V1::ReportsController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler

  before_action :authenticate_user!

  def time_entries_by_weeks
    @report_items = TimeEntryReport.by_weeks(
      user: target_user,
      from_date: report_params[:from_date],
      to_date: report_params[:to_date]
    )

    json_response(@report_items)
  end

  private

    def target_user
      if current_user.admin?
        find_user = User.where(id: params[:user_id]).first
        find_user || current_user
      else
        current_user
      end
    end

    def report_params
      params.permit(:from_date, :to_date, :user_id)
    end
end
