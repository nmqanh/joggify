Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'api/v1/auth'
  get "/" => "pages#home"
  get "/report" => "pages#home"
  get "/signup" => "pages#home"
  get "/account-settings" => "pages#home"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
