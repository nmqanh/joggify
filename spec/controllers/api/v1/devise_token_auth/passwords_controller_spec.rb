require "rails_helper"

RSpec.describe "Password Update", type: :request do
  let!(:user) { create :user, password: "test123!" }

  let(:params) do
    {
      reset_password_token: @password_reset_token,
      password: "password"
    }
  end

  subject { patch "/api/v1/auth/password", params: params }

  before do
    @password_reset_token = user.send_reset_password_instructions
  end

  it "returns 200" do
    subject
    expect(response.status).to eq(200)
  end

  it "updates the user password" do
    subject
    expect(user.reload.valid_password?("password")).to be_truthy
  end

  it "does not allow the reset_password_token to be used twice" do
    subject
    expect(user.reload.reset_password_token).to be_nil
  end

  context "no reset password" do
    let(:params) do
      {
        password: "password"
      }
    end

    it "does not reset password without token AND without current password" do
      expect { subject }.to_not change {
        user.reload.valid_password?("test123!")
      }.from(true)
    end

    it "returns 401" do
      subject
      expect(response.status).to eq(401)
    end
  end
end
