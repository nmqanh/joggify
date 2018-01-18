class Api::V1::ReportsController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler
  include Api::V1::TimeEntriesHelper

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

    def report_params
      params.permit(:from_date, :to_date)
    end
end
