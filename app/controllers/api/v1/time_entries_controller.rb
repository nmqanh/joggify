class Api::V1::TimeEntriesController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler
  include Api::V1::TimeEntriesHelper

  before_action :authenticate_user!
  before_action :set_time_entry, only: [:show, :update, :destroy]

  def index
    @time_entries = TimeEntryQuery.filter(
      user: target_user,
      page: filter_params[:page],
      is_date_ascending: filter_params[:is_date_ascending] == "true",
      from_date: filter_params[:from_date],
      to_date: filter_params[:to_date]
    )
    json_response(@time_entries)
  end

  def create
    @time_entry = target_user.time_entries.build(time_entry_params)
    authorize @time_entry
    @time_entry.save!
    json_response(@time_entry, :created)
  end

  def update
    authorize @time_entry
    @time_entry.update!(time_entry_params)
    json_response(@time_entry)
  end

  def destroy
    authorize @time_entry
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
