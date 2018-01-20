require "rails_helper"

RSpec.describe "Token Validations", type: :request do
  describe "signed in" do
    let!(:user) { create :user }

    it "should respond with success" do
      auth_get "/api/v1/auth/validate_token", user: user
      expect(response).to have_http_status(:success)
    end
  end

  describe "signed out" do
    it "should respond with unauthorized" do
      auth_get "/api/v1/auth/validate_token"
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
