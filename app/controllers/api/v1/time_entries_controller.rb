class Api::V1::TimeEntriesController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler

  before_action :authenticate_user!
  before_action :set_time_entry, only: [:show, :update, :destroy]

  def index
    @time_entries = TimeEntryQuery.filter(
      user: current_user,
      page: filter_params[:page],
      is_date_ascending: filter_params[:is_date_ascending] == "true",
      from_date: filter_params[:from_date],
      to_date: filter_params[:to_date]
    )

    json_response(@time_entries)
  end

  def create
    @time_entry = current_user.time_entries.create!(time_entry_params)
    json_response(@time_entry, :created)
  end

  def show
    json_response(@time_entry)
  end

  def update
    @time_entry.update!(time_entry_params)
    json_response(@time_entry)
  end

  def destroy
    @time_entry.destroy
    head :no_content
  end

  private

    def filter_params
      params.permit(:page, :is_date_ascending, :from_date, :to_date)
    end

    def time_entry_params
      params.permit(:duration_in_minutes, :distance_in_kilometres, :date)
    end

    def set_time_entry
      @time_entry ||= TimeEntry.find(params[:id])
    end
end
