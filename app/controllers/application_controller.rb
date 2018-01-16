class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception, prepend: true
  protect_from_forgery with: :null_session, prepend: true
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_timezone

  private

    def set_timezone
      tz = current_user ? current_user.timezone : nil
      Time.zone = tz || ActiveSupport::TimeZone["Brisbane"]
    end

  protected

    def configure_permitted_parameters
      if params[:timezone_offset]
        params[:timezone] = ActiveSupport::TimeZone[-params[:timezone_offset].to_i.minutes].tzinfo.name
        params.delete :timezone_offset
      end
      devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :name, :timezone])
      devise_parameter_sanitizer.permit(:account_update, keys: [:email, :name, :timezone])
    end
end
