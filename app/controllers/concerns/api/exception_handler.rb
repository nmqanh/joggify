module Api::ExceptionHandler
  extend ActiveSupport::Concern
  included do
    rescue_from ActiveRecord::RecordNotFound do |e|
      json_response({ message: e.message }, :not_found)
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      json_response({ message: e.message }, :unprocessable_entity)
    end

    rescue_from Pundit::NotAuthorizedError do |e|
      json_response({ message: "You are not authorized to perform this action." }, :forbidden)
    end
  end
end
