Rails.application.routes.draw do
  mount_devise_token_auth_for "User", at: "api/v1/auth"
  get "/" => "pages#home"
  get "/report" => "pages#home"
  get "/signup" => "pages#home"
  get "/account-settings" => "pages#home"
  get "/users" => "pages#home"

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
