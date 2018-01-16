class Api::V1::UsersController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler

  before_action :authenticate_user!
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    @users = User.all

    if params[:query].present?
      @users = @users.search_by_name_or_email(params[:query])
    end

    json_response(@users)
  end

  def create
    @user = User.create!(user_params)
    json_response(@user, :created)
  end

  def show
    json_response(@user)
  end

  def update
    @user.update!(user_params)
    json_response(@user)
  end

  def destroy
    @user.destroy
    head :no_content
  end

  private

    def filter_params
      params.permit(:q)
    end

    def user_params
      params.permit(:email, :password, :timezone, :name, :role)
    end

    def set_user
      @user ||= User.find(params[:id])
    end
end
