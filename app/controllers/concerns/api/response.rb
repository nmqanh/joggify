module Api::Response
  def json_response(object, status = :ok)
    render json: object, key_transform: :camel_lower, status: status
  end
end
