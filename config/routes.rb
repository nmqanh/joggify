Rails.application.routes.draw do
  mount_devise_token_auth_for "User", at: "api/v1/auth",
  controllers: {
    passwords: "api/v1/devise_token_auth/passwords"
  }

  devise_scope :user do
    post "/api/v1/auth/password/reset", to: "api/v1/devise_token_auth/passwords#reset"
  end

  get "/" => "pages#home"
  get "/report" => "pages#home"
  get "/signup" => "pages#home"
  get "/account-settings" => "pages#home"
  get "/users" => "pages#home"
  get "/reset" => "pages#home"
  get "/forgot" => "pages#home"

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :time_entries
      resources :users do
        collection do
          get :search
        end
      end
      resources :reports, only: [] do
        collection do
          get :time_entries_by_weeks
        end
      end
    end
  end
end
