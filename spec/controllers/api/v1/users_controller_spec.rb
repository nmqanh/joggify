require "rails_helper"

RSpec.describe Api::V1::UsersController, type: :controller do
  let!(:admin_user)         { create :admin_user }
  let!(:manager_user)       { create :manager_user }
  let!(:other_manager_user) { create :manager_user }
  let!(:other_admin_user)   { create :admin_user }
  let!(:normal_user)        { create :user }
  let!(:other_user)         { create :user }

  let(:new_user_params) {
    {
      email: Faker::Internet.email,
      timezone: "Australia/Brisbane",
      password: Faker::Internet.password(10, 20),
      name: Faker::Name.name,
      role: "user"
    }
  }

  let(:update_user_params) {
    {
      id: other_user.id,
      email: Faker::Internet.email,
      timezone: "Australia/Brisbane",
      password: Faker::Internet.password(10, 20),
      name: Faker::Name.name,
      role: "user"
    }
  }

  let(:all_current_users_json) {
    {
      total: User.all.count,
      perPage: User.per_page,
      users: ActiveModel::Serializer::CollectionSerializer.new(
        User.order(id: :desc), each_serializer: UserSerializer
      ).as_json
    }
  }

  describe "non-signed in user tries to access user-apis" do
    describe "action index" do
      subject { get :index }
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end
    describe "action create" do
      subject { post :create, params: new_user_params }
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end
    describe "action update" do
      subject { patch :update, params: update_user_params }
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end
    describe "action destroy" do
      subject { delete :destroy, params: { id: other_user.id } }
      it "should return 401" do
        subject
        expect(response).to have_http_status(401)
      end
    end
  end

  describe "normal user tries to access user-apis" do
    before { token_sign_in normal_user }
    describe "action index" do
      subject { get :index }
      it "should return 403" do
        subject
        expect(response).to have_http_status(403)
      end
    end
    describe "action create" do
      subject { post :create, params: new_user_params }
      it "should return 403" do
        subject
        expect(response).to have_http_status(403)
      end
    end
    describe "action update" do
      subject { patch :update, params: update_user_params }
      it "should return 403" do
        subject
        expect(response).to have_http_status(403)
      end
    end
    describe "action destroy" do
      subject { delete :destroy, params: { id: other_user.id } }
      it "should return 403" do
        subject
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "manager user tries to access user-apis" do
    before { token_sign_in manager_user }
    describe "action index" do
      subject { get :index }

      it "should return all current users" do
        subject
        expect(response.body).to eql CaseTransform.camel_lower(all_current_users_json).to_json
      end
    end

    describe "action create" do
      describe "create new normal user" do
        subject { post :create, params: new_user_params }
        it "should create new user" do
          expect { subject }.to change { User.all.count }.by(1)
          new_user = User.find_by_email(new_user_params[:email])
          expect(new_user).to_not be_nil
          expect(new_user.role).to eql("user")
        end
      end

      describe "create new manager user" do
        let!(:new_user_params) {
          {
            email: Faker::Internet.email,
            timezone: "Australia/Brisbane",
            password: Faker::Internet.password(10, 20),
            name: Faker::Name.name,
            role: "manager"
          }
        }
        subject { post :create, params: new_user_params }
        it "should create new user" do
          expect { subject }.to change { User.all.count }.by(1)
          new_user = User.find_by_email(new_user_params[:email])
          expect(new_user).to_not be_nil
          expect(new_user.role).to eql("manager")
        end
      end

      describe "create new admin user" do
        let!(:new_user_params) {
          {
            email: Faker::Internet.email,
            timezone: "Australia/Brisbane",
            password: Faker::Internet.password(10, 20),
            name: Faker::Name.name,
            role: "admin"
          }
        }
        subject { post :create, params: new_user_params }
        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end
    end

    describe "action update" do
      describe "update normal user" do
        subject { patch :update, params: update_user_params }
        it "should update normal user" do
          subject
          updated_user = User.find_by_email(update_user_params[:email])
          expect(updated_user).to_not be_nil
          expect(updated_user.role).to eql("user")
        end
      end

      describe "update manager user" do
        let!(:update_user_params) {
        {
          id: other_manager_user.id,
          email: Faker::Internet.email,
          timezone: "Australia/Brisbane",
          password: Faker::Internet.password(10, 20),
          name: Faker::Name.name,
          role: "user"
        }
      }
        subject { patch :update, params: update_user_params }
        it "should update other manager user to normal user" do
          subject
          updated_user = User.find_by_email(update_user_params[:email])
          expect(updated_user).to_not be_nil
          expect(updated_user.role).to eql("user")
        end
      end

      describe "update admin user" do
        let!(:update_user_params) {
        {
          id: admin_user.id,
          email: Faker::Internet.email,
          timezone: "Australia/Brisbane",
          password: Faker::Internet.password(10, 20),
          name: Faker::Name.name,
          role: "manager"
        }
      }
        subject { patch :update, params: update_user_params }
        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end

      describe "update normal user to manager" do
        let!(:update_user_params) {
          {
            id: other_user.id,
            role: "manager"
          }
        }
        subject { patch :update, params: update_user_params }
        it "should update normal user" do
          expect { subject }.to change { other_user.reload.role }.from("user").to("manager")
        end
      end

      describe "update normal user to admin" do
        let!(:update_user_params) {
          {
            id: other_user.id,
            role: "admin"
          }
        }
        subject { patch :update, params: update_user_params }
        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end
    end

    describe "action destroy" do
      describe "delete normal user" do
        subject { delete :destroy, params: { id: normal_user.id } }
        it "should delete normal user" do
          subject
          expect(User.find_by_email(normal_user.email)).to be_nil
        end
      end

      describe "delete other manager user" do
        subject { delete :destroy, params: { id: other_manager_user.id } }
        it "should delete other manager user" do
          subject
          expect(User.find_by_email(other_manager_user.email)).to be_nil
        end
      end

      describe "delete him self" do
        subject { delete :destroy, params: { id: manager_user.id } }
        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end

      describe "delete an admin user" do
        subject { delete :destroy, params: { id: admin_user.id } }
        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "admin user tries to access user-apis" do
    before { token_sign_in admin_user }
    describe "action index" do
      subject { get :index }

      it "should return all current users" do
        subject
        expect(response.body).to eql CaseTransform.camel_lower(all_current_users_json).to_json
      end
    end

    describe "action create" do
      describe "create new normal user" do
        subject { post :create, params: new_user_params }
        it "should create new user" do
          expect { subject }.to change { User.all.count }.by(1)
          new_user = User.find_by_email(new_user_params[:email])
          expect(new_user).to_not be_nil
          expect(new_user.role).to eql("user")
        end
      end

      describe "create new manager user" do
        let!(:new_user_params) {
          {
            email: Faker::Internet.email,
            timezone: "Australia/Brisbane",
            password: Faker::Internet.password(10, 20),
            name: Faker::Name.name,
            role: "manager"
          }
        }
        subject { post :create, params: new_user_params }
        it "should create new user" do
          expect { subject }.to change { User.all.count }.by(1)
          new_user = User.find_by_email(new_user_params[:email])
          expect(new_user).to_not be_nil
          expect(new_user.role).to eql("manager")
        end
      end

      describe "create new admin user" do
        let!(:new_user_params) {
          {
            email: Faker::Internet.email,
            timezone: "Australia/Brisbane",
            password: Faker::Internet.password(10, 20),
            name: Faker::Name.name,
            role: "admin"
          }
        }
        subject { post :create, params: new_user_params }
        it "create new admin user normally" do
          expect { subject }.to change { User.all.count }.by(1)
          new_user = User.find_by_email(new_user_params[:email])
          expect(new_user).to_not be_nil
          expect(new_user.role).to eql("admin")
        end
      end
    end

    describe "action update" do
      describe "update normal user" do
        subject { patch :update, params: update_user_params }
        it "should update normal user" do
          subject
          updated_user = User.find_by_email(update_user_params[:email])
          expect(updated_user).to_not be_nil
          expect(updated_user.role).to eql("user")
        end
      end

      describe "update manager user" do
        let!(:update_user_params) {
        {
          id: other_manager_user.id,
          email: Faker::Internet.email,
          timezone: "Australia/Brisbane",
          password: Faker::Internet.password(10, 20),
          name: Faker::Name.name,
          role: "user"
        }
      }
        subject { patch :update, params: update_user_params }
        it "should update other manager user to normal user" do
          subject
          updated_user = User.find_by_email(update_user_params[:email])
          expect(updated_user).to_not be_nil
          expect(updated_user.role).to eql("user")
        end
      end

      describe "update other admin user to manager" do
        let!(:update_user_params) {
        {
          id: other_admin_user.id,
          email: Faker::Internet.email,
          timezone: "Australia/Brisbane",
          password: Faker::Internet.password(10, 20),
          name: Faker::Name.name,
          role: "manager"
        }
      }
        subject { patch :update, params: update_user_params }
        it "update other admin user normally" do
          subject
          updated_user = User.find_by_email(update_user_params[:email])
          expect(updated_user).to_not be_nil
          expect(updated_user.role).to eql("manager")
        end
      end

      describe "update normal user to manager" do
        let!(:update_user_params) {
          {
            id: other_user.id,
            role: "manager"
          }
        }
        subject { patch :update, params: update_user_params }
        it "should update normal user" do
          expect { subject }.to change { other_user.reload.role }.from("user").to("manager")
        end
      end

      describe "update normal user to admin" do
        let!(:update_user_params) {
          {
            id: other_user.id,
            role: "admin"
          }
        }
        subject { patch :update, params: update_user_params }
        it "update normal user to admin user" do
          expect { subject }.to change { other_user.reload.role }.from("user").to("admin")
        end
      end
    end

    describe "action destroy" do
      describe "delete normal user" do
        subject { delete :destroy, params: { id: normal_user.id } }
        it "should delete normal user" do
          subject
          expect(User.find_by_email(normal_user.email)).to be_nil
        end
      end

      describe "delete other manager user" do
        subject { delete :destroy, params: { id: other_manager_user.id } }
        it "should delete other manager user" do
          subject
          expect(User.find_by_email(other_manager_user.email)).to be_nil
        end
      end

      describe "delete him self" do
        subject { delete :destroy, params: { id: admin_user.id } }
        it "should return 403" do
          subject
          expect(response).to have_http_status(403)
        end
      end

      describe "delete other admin user" do
        subject { delete :destroy, params: { id: other_admin_user.id } }
        it "should delete other admin normally" do
          subject
          expect(User.find_by_email(other_admin_user.email)).to be_nil
        end
      end
    end
  end
end
