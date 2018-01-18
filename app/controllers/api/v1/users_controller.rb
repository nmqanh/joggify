class Api::V1::UsersController < ApplicationController
  include Api::Response
  include Api::ExceptionHandler

  before_action :authenticate_user!
  before_action :check_allowed_role!, only: [:create, :update]
  before_action :set_user, only: [:show, :update, :destroy]

  def index
    authorize User
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
    authorize User
    @users = User.all

    if search_params[:query].present?
      @users = @users.search_by_name_or_email(search_params[:query])
    end

    json_response(@users.limit(10))
  end

  def create
    @user = User.new(user_params)
    authorize @user
    @user.save!
    json_response(@user, :created)
  end

  def update
    authorize @user
    @user.update!(user_params)
    json_response(@user)
  end

  def destroy
    authorize @user
    @user.destroy
    head :no_content
  end

  private
    def check_allowed_role!
      unless current_user.admin? || user_params[:role] != "admin"
        json_response({
          message: "You are not authorized to perform this action."
          },
          :forbidden
        )
      end
    end

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
