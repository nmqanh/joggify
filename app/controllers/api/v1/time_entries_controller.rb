class Api::V1::TimeEntriesController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler

  before_action :authenticate_user!
  before_action :set_time_entry, only: [:show, :update, :destroy]

  def index
    @time_entries = TimeEntry.where(user: current_user)

    if params[:from_date].present? && params[:to_date].present?
      @time_entries = @time_entries.where(
        "date >= ? AND date <= ?", from_date, to_date
      )
    end

    @time_entries = @time_entries.order(
      date: order_params,
      created_at: order_params
    )

    json_response(@time_entries.paginate(page: params[:page]))
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

    def from_date
      Time.zone.parse(params[:from_date]).utc.to_date.to_s
    end

    def to_date
      Time.zone.parse(params[:to_date]).utc.to_date.to_s
    end

    def order_params
      params[:is_date_ascending] == "true" ? :asc : :desc
    end

    def time_entry_params
      params.permit(:duration_in_minutes, :distance_in_kilometres, :date)
    end

    def set_time_entry
      @time_entry ||= TimeEntry.find(params[:id])
    end
end
