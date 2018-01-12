class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  protect_from_forgery with: :exception
  protect_from_forgery with: :null_session

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_timezone

  private

    def set_timezone
      tz = current_user ? current_user.timezone : nil
      Time.zone = tz || ActiveSupport::TimeZone["Brisbane"]
    end

  protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :name, :timezone])
      devise_parameter_sanitizer.permit(:account_update, keys: [:email, :name, :timezone])
    end
end
