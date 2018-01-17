class Api::V1::UsersController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler

  before_action :authenticate_user!
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    @users = User.all.order(id: :desc)

    if search_params[:role].present?
      @users = @users.where(role: search_params[:role])
    end

    if search_params[:query].present?
      @users = @users.search_by_name_or_email(search_params[:query])
    end

    json_response(
      total: @users.count,
      perPage: User.per_page,
      users: ActiveModel::Serializer::CollectionSerializer.new(
        @users.paginate(page: params[:page]), each_serializer: UserSerializer
      )
    )
  end

  def search
    @users = User.all

    if search_params[:query].present?
      @users = @users.search_by_name_or_email(search_params[:query])
    end

    json_response(@users.limit(10))
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

    def search_params
      params.permit(:query, :role)
    end

    def user_params
      params.permit(:email, :password, :timezone, :name, :role)
    end

    def set_user
      @user ||= User.find(params[:id])
    end
end
