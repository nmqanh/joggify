module AuthHelper
  module Controller
    def token_sign_in(user)
      @request.env["devise.mapping"] = Devise.mappings[:merchant]
      @request.headers.merge! user.create_new_auth_token
      sign_in user
    end
  end

  module Request
    %i(get post put patch delete).each do |http_method|
      # auth_get, auth_post, auth_put, auth_patch, auth_delete
      define_method("auth_#{http_method}") do |action_name, params: {}, headers: {}, user: nil|
        if user
          auth_headers = user.create_new_auth_token
          headers = headers.merge(auth_headers)
        end
        public_send(http_method, action_name, params: params, headers: headers)
      end
    end
  end

  module Feature
    def ui_sign_in(user, route: "/")
      visit route
      user.update_attributes(password: "p@ssw0rd")
      fill_in "email", with: user.email
      fill_in "password", with: "p@ssw0rd"
      click_button "SIGN IN"
    end
  end
end
